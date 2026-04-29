
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'learner');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SITE CONTENT ============
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins write content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ APPLICATIONS ============
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_first_name TEXT NOT NULL,
  learner_last_name TEXT NOT NULL,
  learner_id_number TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  hearing_status TEXT,
  previous_school TEXT,
  grade_applying_for TEXT,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit application" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view applications" ON public.applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update applications" ON public.applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete applications" ON public.applications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ LEARNERS ============
CREATE TABLE public.learners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  admission_number TEXT UNIQUE NOT NULL,
  id_number TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grade TEXT,
  date_of_birth DATE,
  guardian_name TEXT,
  guardian_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners see own record" ON public.learners FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage learners" ON public.learners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ LEARNER REPORTS ============
CREATE TABLE public.learner_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES public.learners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  term TEXT,
  year INT,
  doc_type TEXT DEFAULT 'report',
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.learner_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners view own reports" ON public.learner_reports FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM public.learners l WHERE l.id = learner_id AND l.user_id = auth.uid())
  );
CREATE POLICY "Admins manage reports" ON public.learner_reports FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES ('learner-reports', 'learner-reports', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- learner-reports: admins read/write all; learners read only their own (path = learner_id/...)
CREATE POLICY "Admins read reports bucket" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'learner-reports' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write reports bucket" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'learner-reports' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update reports bucket" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'learner-reports' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete reports bucket" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'learner-reports' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Learners read own reports files" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'learner-reports' AND
    EXISTS (
      SELECT 1 FROM public.learners l
      WHERE l.user_id = auth.uid()
      AND (storage.foldername(name))[1] = l.id::text
    )
  );

-- site-images: public read, admin write
CREATE POLICY "Public read site images" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');
CREATE POLICY "Admins write site images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

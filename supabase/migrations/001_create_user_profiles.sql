-- Migration 001: User Profiles
-- Extends Supabase auth.users with app-specific fields

CREATE TABLE public.user_profiles (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  country      CHAR(2) NOT NULL DEFAULT 'NL',
  organisation TEXT,
  role         TEXT NOT NULL DEFAULT 'user'
               CHECK (role IN ('user', 'moderator', 'admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, name, country, organisation)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'NL'),
    NEW.raw_user_meta_data->>'organisation'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

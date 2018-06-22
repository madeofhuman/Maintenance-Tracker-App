DROP DATABASE IF EXISTS "maintain-r";
DROP DATABASE IF EXISTS "maintain-r-test";
CREATE DATABASE "maintain-r";
CREATE DATABASE "maintain-r-test";

\connect "maintain-r-test"
CREATE TABLE IF NOT EXISTS users(
  id serial,
  first_name character varying(11) NOT NULL,
  last_name character varying(11) NOT NULL,
  email character varying(40) NOT NULL,
  role character varying(5) NOT NULL,
  password_hash character varying(250) NOT NULL,
  created_at timestamp with time zone,
  CONSTRAINT unique_data UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS requests(
  id serial,
  type character varying(11) NOT NULL,
  item character varying(30) NOT NULL,
  model character varying(30),
  detail text,
  status character varying(11) NOT NULL,
  owner character varying(40) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT requests_pkey PRIMARY KEY (id)
);

\connect "maintain-r"
CREATE TABLE IF NOT EXISTS users(
  id serial,
  first_name character varying(11) NOT NULL,
  last_name character varying(11) NOT NULL,
  email character varying(40) NOT NULL,
  role character varying(5) NOT NULL,
  password_hash character varying(250) NOT NULL,
  created_at timestamp with time zone,
  CONSTRAINT unique_data UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS requests(
  id serial,
  type character varying(11) NOT NULL,
  item character varying(30) NOT NULL,
  model character varying(30),
  detail text,
  status character varying(11) NOT NULL,
  owner character varying(40) NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT requests_pkey PRIMARY KEY (id)
);
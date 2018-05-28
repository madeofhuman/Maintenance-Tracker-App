CREATE TABLE IF NOT EXISTS users(
  id serial,
  first_name character varying(11),
  last_name character varying(11),
  email character varying(40),
  role character varying(5),
  password_hash character varying(250),
  created_at time with time zone,
  CONSTRAINT unique_data UNIQUE (email)
);


CREATE TABLE IF NOT EXISTS requests(
  id serial,
  type character varying(11),
  item character varying(30),
  model character varying(30),
  detail text,
  status character varying(11),
  owner character varying(40),
  created_at time with time zone,
  updated_at time with time zone,
  CONSTRAINT requests_pkey PRIMARY KEY (id)
);
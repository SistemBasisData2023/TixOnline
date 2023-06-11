--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-06-11 21:42:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 863 (class 1247 OID 204801)
-- Name: movie_genre; Type: TYPE; Schema: public; Owner: rroiii
--

CREATE TYPE public.movie_genre AS ENUM (
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Other'
);


ALTER TYPE public.movie_genre OWNER TO rroiii;

--
-- TOC entry 890 (class 1247 OID 294928)
-- Name: movie_status; Type: TYPE; Schema: public; Owner: rroiii
--

CREATE TYPE public.movie_status AS ENUM (
    'UPCOMING',
    'SHOWING',
    'SHOWED'
);


ALTER TYPE public.movie_status OWNER TO rroiii;

--
-- TOC entry 872 (class 1247 OID 213005)
-- Name: studio_type; Type: TYPE; Schema: public; Owner: rroiii
--

CREATE TYPE public.studio_type AS ENUM (
    'Reguler',
    'Deluxe'
);


ALTER TYPE public.studio_type OWNER TO rroiii;

--
-- TOC entry 887 (class 1247 OID 294920)
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: rroiii
--

CREATE TYPE public.transaction_status AS ENUM (
    'WAITING',
    'DONE',
    'CANCELED'
);


ALTER TYPE public.transaction_status OWNER TO rroiii;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 450563)
-- Name: admins; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    username character varying(30) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public.admins OWNER TO rroiii;

--
-- TOC entry 234 (class 1259 OID 450562)
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_admin_id_seq OWNER TO rroiii;

--
-- TOC entry 2705 (class 0 OID 0)
-- Dependencies: 234
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- TOC entry 215 (class 1259 OID 204831)
-- Name: movies; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    title character varying(50) NOT NULL,
    genre public.movie_genre NOT NULL,
    duration text NOT NULL,
    release_date text NOT NULL,
    synopsis text,
    status public.movie_status,
    trailer_link character varying(50),
    images text,
    rating character varying(5)
);


ALTER TABLE public.movies OWNER TO rroiii;

--
-- TOC entry 214 (class 1259 OID 204830)
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movies_movie_id_seq OWNER TO rroiii;

--
-- TOC entry 2706 (class 0 OID 0)
-- Dependencies: 214
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- TOC entry 240 (class 1259 OID 466945)
-- Name: payout; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.payout (
    payout_id integer NOT NULL,
    transaction_id integer,
    payout_link text NOT NULL
);


ALTER TABLE public.payout OWNER TO rroiii;

--
-- TOC entry 239 (class 1259 OID 466944)
-- Name: payout_payout_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.payout_payout_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payout_payout_id_seq OWNER TO rroiii;

--
-- TOC entry 2707 (class 0 OID 0)
-- Dependencies: 239
-- Name: payout_payout_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.payout_payout_id_seq OWNED BY public.payout.payout_id;


--
-- TOC entry 233 (class 1259 OID 417793)
-- Name: remember_me_tokens; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.remember_me_tokens (
    remember_me_tokens_id integer NOT NULL,
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.remember_me_tokens OWNER TO rroiii;

--
-- TOC entry 232 (class 1259 OID 417792)
-- Name: remember_me_tokens_remember_me_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.remember_me_tokens_remember_me_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.remember_me_tokens_remember_me_tokens_id_seq OWNER TO rroiii;

--
-- TOC entry 2708 (class 0 OID 0)
-- Dependencies: 232
-- Name: remember_me_tokens_remember_me_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.remember_me_tokens_remember_me_tokens_id_seq OWNED BY public.remember_me_tokens.remember_me_tokens_id;


--
-- TOC entry 223 (class 1259 OID 254054)
-- Name: schedule; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.schedule (
    schedule_id integer NOT NULL,
    movie_id integer,
    studio_id integer,
    date date NOT NULL,
    hours character varying(5) NOT NULL,
    prices integer NOT NULL
);


ALTER TABLE public.schedule OWNER TO rroiii;

--
-- TOC entry 222 (class 1259 OID 254053)
-- Name: schedule_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.schedule_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_schedule_id_seq OWNER TO rroiii;

--
-- TOC entry 2709 (class 0 OID 0)
-- Dependencies: 222
-- Name: schedule_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.schedule_schedule_id_seq OWNED BY public.schedule.schedule_id;


--
-- TOC entry 225 (class 1259 OID 262145)
-- Name: scheduleseats; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.scheduleseats (
    schedule_seat_id integer NOT NULL,
    schedule_id integer NOT NULL,
    seat_id integer NOT NULL
);


ALTER TABLE public.scheduleseats OWNER TO rroiii;

--
-- TOC entry 224 (class 1259 OID 262144)
-- Name: scheduleseats_schedule_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.scheduleseats_schedule_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scheduleseats_schedule_seat_id_seq OWNER TO rroiii;

--
-- TOC entry 2710 (class 0 OID 0)
-- Dependencies: 224
-- Name: scheduleseats_schedule_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.scheduleseats_schedule_seat_id_seq OWNED BY public.scheduleseats.schedule_seat_id;


--
-- TOC entry 221 (class 1259 OID 254042)
-- Name: seats; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.seats (
    seat_id integer NOT NULL,
    studio_id integer,
    seat_number character varying(5) NOT NULL
);


ALTER TABLE public.seats OWNER TO rroiii;

--
-- TOC entry 220 (class 1259 OID 254041)
-- Name: seats_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.seats_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.seats_seat_id_seq OWNER TO rroiii;

--
-- TOC entry 2711 (class 0 OID 0)
-- Dependencies: 220
-- Name: seats_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.seats_seat_id_seq OWNED BY public.seats.seat_id;


--
-- TOC entry 219 (class 1259 OID 254035)
-- Name: studios; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.studios (
    studio_id integer NOT NULL,
    name character varying(20) NOT NULL,
    type public.studio_type NOT NULL,
    theater_id integer
);


ALTER TABLE public.studios OWNER TO rroiii;

--
-- TOC entry 218 (class 1259 OID 254034)
-- Name: studios_studio_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.studios_studio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.studios_studio_id_seq OWNER TO rroiii;

--
-- TOC entry 2712 (class 0 OID 0)
-- Dependencies: 218
-- Name: studios_studio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.studios_studio_id_seq OWNED BY public.studios.studio_id;


--
-- TOC entry 231 (class 1259 OID 401409)
-- Name: theaters; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.theaters (
    theater_id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city character varying(50) NOT NULL,
    theater_images text NOT NULL
);


ALTER TABLE public.theaters OWNER TO rroiii;

--
-- TOC entry 230 (class 1259 OID 401408)
-- Name: theaters_theater_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.theaters_theater_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.theaters_theater_id_seq OWNER TO rroiii;

--
-- TOC entry 2713 (class 0 OID 0)
-- Dependencies: 230
-- Name: theaters_theater_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.theaters_theater_id_seq OWNED BY public.theaters.theater_id;


--
-- TOC entry 229 (class 1259 OID 294948)
-- Name: tickets; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.tickets (
    ticket_id integer NOT NULL,
    transaction_id integer,
    schedule_id integer,
    seat_id integer
);


ALTER TABLE public.tickets OWNER TO rroiii;

--
-- TOC entry 228 (class 1259 OID 294947)
-- Name: tickets_ticket_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.tickets_ticket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tickets_ticket_id_seq OWNER TO rroiii;

--
-- TOC entry 2714 (class 0 OID 0)
-- Dependencies: 228
-- Name: tickets_ticket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.tickets_ticket_id_seq OWNED BY public.tickets.ticket_id;


--
-- TOC entry 227 (class 1259 OID 294936)
-- Name: transactions; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    user_id integer,
    quantity integer NOT NULL,
    transaction_status public.transaction_status NOT NULL,
    transaction_date timestamp without time zone NOT NULL,
    payment_max_date timestamp without time zone
);


ALTER TABLE public.transactions OWNER TO rroiii;

--
-- TOC entry 236 (class 1259 OID 458752)
-- Name: transactions_with_tickets; Type: VIEW; Schema: public; Owner: rroiii
--

CREATE VIEW public.transactions_with_tickets AS
SELECT
    NULL::integer AS transaction_id,
    NULL::integer AS user_id,
    NULL::integer AS quantity,
    NULL::public.transaction_status AS transaction_status,
    NULL::timestamp without time zone AS transaction_date,
    NULL::timestamp without time zone AS payment_max_date,
    NULL::integer[] AS ticket_ids,
    NULL::integer AS schedule_id,
    NULL::integer[] AS seats_ids;


ALTER TABLE public.transactions_with_tickets OWNER TO rroiii;

--
-- TOC entry 237 (class 1259 OID 458757)
-- Name: transactions_details; Type: VIEW; Schema: public; Owner: rroiii
--

CREATE VIEW public.transactions_details AS
 SELECT t.transaction_id,
    t.user_id,
    t.quantity,
    t.transaction_status,
    t.transaction_date,
    t.payment_max_date,
    t.ticket_ids,
    t.schedule_id,
    t.seats_ids,
    s.date,
    s.hours,
    s.prices,
    (array_length(t.ticket_ids, 1) * s.prices) AS total_prices,
    m.title,
    stud.name AS studio_name,
    stud.type,
    thea.name AS theater_name,
    thea.address,
    thea.city
   FROM ((((public.transactions_with_tickets t
     JOIN public.schedule s ON ((t.schedule_id = s.schedule_id)))
     JOIN public.movies m ON ((m.movie_id = s.movie_id)))
     JOIN public.studios stud ON ((stud.studio_id = s.studio_id)))
     JOIN public.theaters thea ON ((stud.theater_id = thea.theater_id)));


ALTER TABLE public.transactions_details OWNER TO rroiii;

--
-- TOC entry 238 (class 1259 OID 458762)
-- Name: transactions_details_seats; Type: VIEW; Schema: public; Owner: rroiii
--

CREATE VIEW public.transactions_details_seats AS
 SELECT td.transaction_id,
    td.user_id,
    td.quantity,
    td.transaction_status,
    td.transaction_date,
    td.ticket_ids,
    td.schedule_id,
    td.seats_ids,
    td.date,
    td.payment_max_date,
    td.hours,
    td.prices,
    td.total_prices,
    td.title,
    td.studio_name,
    td.type,
    td.theater_name,
    td.address,
    td.city,
    array_agg(s.seat_number) AS seat_numbers
   FROM (public.transactions_details td
     JOIN public.seats s ON ((s.seat_id = ANY (td.seats_ids))))
  GROUP BY td.user_id, td.transaction_id, td.seats_ids, td.quantity, td.transaction_status, td.transaction_date, td.ticket_ids, td.schedule_id, td.date, td.hours, td.prices, td.total_prices, td.title, td.studio_name, td.type, td.theater_name, td.address, td.city, td.payment_max_date;


ALTER TABLE public.transactions_details_seats OWNER TO rroiii;

--
-- TOC entry 226 (class 1259 OID 294935)
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_transaction_id_seq OWNER TO rroiii;

--
-- TOC entry 2715 (class 0 OID 0)
-- Dependencies: 226
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- TOC entry 217 (class 1259 OID 204854)
-- Name: users; Type: TABLE; Schema: public; Owner: rroiii
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(30) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(100) NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    phone_number character varying(20),
    points integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO rroiii;

--
-- TOC entry 216 (class 1259 OID 204853)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: rroiii
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO rroiii;

--
-- TOC entry 2716 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rroiii
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 2481 (class 2604 OID 450566)
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- TOC entry 2470 (class 2604 OID 204834)
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- TOC entry 2482 (class 2604 OID 466948)
-- Name: payout payout_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.payout ALTER COLUMN payout_id SET DEFAULT nextval('public.payout_payout_id_seq'::regclass);


--
-- TOC entry 2480 (class 2604 OID 417796)
-- Name: remember_me_tokens remember_me_tokens_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.remember_me_tokens ALTER COLUMN remember_me_tokens_id SET DEFAULT nextval('public.remember_me_tokens_remember_me_tokens_id_seq'::regclass);


--
-- TOC entry 2475 (class 2604 OID 254057)
-- Name: schedule schedule_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.schedule ALTER COLUMN schedule_id SET DEFAULT nextval('public.schedule_schedule_id_seq'::regclass);


--
-- TOC entry 2476 (class 2604 OID 262148)
-- Name: scheduleseats schedule_seat_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.scheduleseats ALTER COLUMN schedule_seat_id SET DEFAULT nextval('public.scheduleseats_schedule_seat_id_seq'::regclass);


--
-- TOC entry 2474 (class 2604 OID 254045)
-- Name: seats seat_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.seats ALTER COLUMN seat_id SET DEFAULT nextval('public.seats_seat_id_seq'::regclass);


--
-- TOC entry 2473 (class 2604 OID 254038)
-- Name: studios studio_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.studios ALTER COLUMN studio_id SET DEFAULT nextval('public.studios_studio_id_seq'::regclass);


--
-- TOC entry 2479 (class 2604 OID 401412)
-- Name: theaters theater_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.theaters ALTER COLUMN theater_id SET DEFAULT nextval('public.theaters_theater_id_seq'::regclass);


--
-- TOC entry 2478 (class 2604 OID 294951)
-- Name: tickets ticket_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.tickets ALTER COLUMN ticket_id SET DEFAULT nextval('public.tickets_ticket_id_seq'::regclass);


--
-- TOC entry 2477 (class 2604 OID 294939)
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- TOC entry 2471 (class 2604 OID 204857)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 2697 (class 0 OID 450563)
-- Dependencies: 235
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.admins (admin_id, username, email, password) FROM stdin;
1	handaneswari	handaneswari13@tix.gmail.com	$2b$10$kqXRzHhMQMn6x2WYP1Oun.Pmp9VGYtmKRt9pEZ0lsWUxjpugx57v2
2	royoswaldha	tes@tix.gmail.com	$2b$10$JNL8v/QgtAHXt/F2Mim4o.JiUeut43wzth4WzDQsjDCxvAp7z56im
\.


--
-- TOC entry 2677 (class 0 OID 204831)
-- Dependencies: 215
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.movies (movie_id, title, genre, duration, release_date, synopsis, status, trailer_link, images, rating) FROM stdin;
4	Evil Dead Rise	Horror	1 Hours 36 Minutes	5 May 2023	A twisted tale of two estranged sisters whose reunion is cut short by the rise of flesh-possessing demons, thrusting them into a primal battle for survival as they face the most nightmarish version of family imaginable.	SHOWING	https://www.youtube.com/watch?v=BqQNO7BzN08	1685570624777 - evil-dead-rise.jpg	17+
5	The Super Mario Bros Movie	Fantasy	1 Hours 32 Minutes	5 April 2023	A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.	SHOWING	https://www.youtube.com/watch?v=TnGl01FkMMo	1685570691063 - the-super-mario-bros-movie.jpg	PG
6	The Covenant	Action	2 Hours 3 Minutes	19 April 2023	During the war in Afghanistan, a local interpreter risks his own life to carry an injured sergeant across miles of grueling terrain.	SHOWING	https://www.youtube.com/watch?v=02PPMPArNEQ	1685570792742 - the-covenant.jpg	17+
7	John Wick : Chapter 4	Thriller	2 Hours 49 Minutes	22 March 2023	John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.	SHOWING	https://www.youtube.com/watch?v=qEVUtrk8_B4	1685570844040 - john-wick---chapter-4.jpg	17+
8	Shazam! Fury of the Gods	Action	2 Hours 10 Minutes	17 March 2023	The film continues the story of teenage Billy Batson who, upon reciting the magic word "SHAZAM!" is transformed into his adult Super Hero alter ego, Shazam.	SHOWING	https://www.youtube.com/watch?v=Zi88i4CpHe4	1685570899094 - shazam--fury-of-the-gods.jpg	13+
10	Blue Beetle	Action	2 hours 45 minutes	18 August 2023	Jaime Reyes suddenly finds himself in possession of an ancient relic of alien biotechnology called the Scarab. When the Scarab chooses Jaime to be its symbiotic host, he's bestowed with an incredible suit of armor that's capable of extraordinary and unpredictable powers, forever changing his destiny as he becomes the superhero Blue Beetle.	UPCOMING	https://www.youtube.com/watch?v=vS3_72Gb-bI	1685571300466 - blue-beetle.jpg	17+
12	The Flash	Action	2 Hours 24 Minutes	16 June 2023	Barry Allen uses his super speed to change the past, but his attempt to save his family creates a world without super heroes, forcing him to race for his life in order to save the future.	UPCOMING	https://www.youtube.com/watch?v=jprhe-cWKGs	1685571432630 - the-flash.jpg	13+
13	Guardians of the Galaxy Vol. 3	Action	2 Hours 30 Minutes	3 May 2023	Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.	UPCOMING	https://www.youtube.com/watch?v=u3V5KDHRQvk	1685571476237 - guardians-of-the-galaxy-vol--3.jpg	13+
14	The Marvels	Action	2 Hours	10 November 2023	Carol Danvers, aka Captain Marvel, has reclaimed her identity from the tyrannical Kree and taken revenge on the Supreme Intelligence. However, unintended consequences see her shouldering the burden of a destabilized universe. When her duties send her to an anomalous wormhole linked to a Kree revolutionary, her powers become entangled with two other superheroes to form the Marvels.	UPCOMING	https://www.youtube.com/watch?v=iuk77TjvfmE	1685571526937 - the-marvels.jpg	13+
15	Oppenheimer	Action	3 Hours	 21 July 2023	The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.	UPCOMING	https://www.youtube.com/watch?v=uYPbbksJxIg	1685571570627 - oppenheimer.jpg	13+
16	Transformers: Rise of the Beasts	Action	2 Hours 7 Minutes	7 June 2023	During the 1990s, the Maximals, Predacons and Terrorcons join the existing battle on Earth between Autobots and Decepticons.	UPCOMING	https://www.youtube.com/watch?v=itnqEauWQZM	1685571620499 - transformers--rise-of-the-beasts.jpg	17+
9	Avatar : The Way of Water	Adventure	3 Hours 12 Minutes	14 December 2022	Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.	SHOWING	https://www.youtube.com/watch?v=d9MyW72ELq0	1685570947913 - avatar--the-way-of-water.jpg	13+
2	Love Again	Romance	1 Hours 44 Minutes	10 May 2023	A young woman tries to ease the pain of her fiancé's death by sending romantic texts to his old cell phone number, and forms a connection with the man the number has been reassigned to.	SHOWING	https://www.youtube.com/watch?v=CQDXtD2HJAs	1685570471713 - love-again.jpg	13+
1	The Little Mermaid	Action	1 Hours 36 Minutes	21 April 2023	An executive goes through an unexpected breakup, then accepting an assignment to go undercover and learn about the tourist.	SHOWING	https://www.youtube.com/watch?v=kpGo2_d3oYE	1686000817744 - .jpg	17+
\.


--
-- TOC entry 2699 (class 0 OID 466945)
-- Dependencies: 240
-- Data for Name: payout; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.payout (payout_id, transaction_id, payout_link) FROM stdin;
1	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-3L022179XA060394C
2	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-4B157848W9648844B
3	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-8V980157T42714832
4	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-87T34221U09988102
5	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-8YV44089V0423373V
6	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-0P037064LR620601L
7	87	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-6G9043835H446145X
8	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-3WE59926NP0453340
9	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-95617189M9176003B
10	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-1LR31765HL904494A
11	91	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-8Y6129917M731084K
12	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-04P09109VU541044Y
13	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-4HM48818TP688793A
14	\N	https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-4NM32170JB0222631
\.


--
-- TOC entry 2695 (class 0 OID 417793)
-- Dependencies: 233
-- Data for Name: remember_me_tokens; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.remember_me_tokens (remember_me_tokens_id, user_id, token, expires_at) FROM stdin;
1	1	YBHpHlAG31N2B6RbJJuqB8PZDbO9XZKI	2023-07-05 17:42:12.095
2	1	HyHqo78UC7r6H5GXrozP1AZ25LA1CfO0	2023-07-05 20:34:08.862
3	1	oFfTzyyyrziXdLMSpgIhv8MkbHqBM8gD	2023-07-05 21:29:17.217
4	1	kEAdEW2OVbkg0gPxKzD0btikhl1zR731	2023-07-05 21:31:19.954
5	1	R2UjqPuEAU9oRtgWlwwJqLf9cSLYAUAv	2023-07-05 21:40:56.365
6	1	1JejssxPK7cVkOoKYwszGzDPgxHejYED	2023-07-05 21:46:23.691
7	1	JwoQmKBfCQ6qhYB52np5LPudjVmqKtES	2023-07-06 01:37:12.836
8	1	hYDBZvYKj6ZKY1Hrefi4iFEAwYndq5ip	2023-07-06 01:42:49.387
9	1	soDStNjZjBeXHNk9F4KlxG4RXatWIIum	2023-07-06 01:52:18.464
10	1	gP7h0RPQJnQ0Vy8OlgPC8DTv8d0l9q5y	2023-07-06 01:52:57.511
11	1	JCEWHAvLdOn3R23riLGilHWnHhTcJ4x9	2023-07-06 03:24:42.613
12	1	1zRejgIxW2ZrhYtZ9zaOczOQ6F2BQiTn	2023-07-06 06:54:58.265
13	1	m9ulVuHCRtjupdYfLxz6Ce2uJ1jkdlC4	2023-07-07 11:13:57.974
14	1	o1427cShDyq8ghgbf4HN0r6lhFgrtg8a	2023-07-07 16:54:35.41
15	1	WBxJymq34ZI0ZjnJbeS4G6608cyKt3kq	2023-07-07 19:31:37.236
16	1	8ROv3Ynd96IdbX9z5JeokPIIYyMXpA3Q	2023-07-07 19:37:10.819
17	1	B4HyNH8iDqMSCdvubZ2hd4ZGTudNIM1e	2023-07-09 14:14:09.141
18	1	RRg9tRLfp6uFrq7wpDgbeHeVB7zVG3Mj	2023-07-09 14:15:20.013
19	1	KxWGOjJpou5gHjX66JWI00eAqWKl5ccu	2023-07-09 20:57:41.456
20	1	q8CMORCAQ0Dd2cundPfWMVFvBwzqYaqW	2023-07-09 23:23:37.337
21	1	D2dpHDbqyCQvSIJZKXN7MmSqd35AJsL1	2023-07-10 20:59:00.244
22	1	EdTivcP3QuRhIvnPJL2h53fnA2w5VYah	2023-07-10 21:47:17.418
23	1	7uPRzyWxkT1xAxw5qkJ95i989uh0BuV0	2023-07-10 23:11:50.796
24	1	IsyTZyZzs0t5PHdkVOBi3trcLQ1yqvDC	2023-07-10 23:12:16.7
\.


--
-- TOC entry 2685 (class 0 OID 254054)
-- Dependencies: 223
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.schedule (schedule_id, movie_id, studio_id, date, hours, prices) FROM stdin;
1	1	1	2023-06-06	10:00	10
2	1	1	2023-06-06	13:00	10
3	1	2	2023-06-06	13:00	12
4	1	2	2023-06-06	16:00	10
5	1	4	2023-06-06	19:00	15
6	1	5	2023-06-06	10:00	15
7	1	6	2023-06-07	13:00	12
8	1	7	2023-06-07	16:00	10
9	1	1	2023-06-07	19:00	15
10	1	2	2023-06-07	10:00	10
11	1	3	2023-06-07	13:00	12
12	1	1	2023-06-08	10:00	10
13	1	1	2023-06-08	13:00	10
14	1	2	2023-06-08	13:00	12
15	1	2	2023-06-08	16:00	10
16	1	4	2023-06-08	19:00	15
17	1	5	2023-06-08	10:00	15
18	1	6	2023-06-09	13:00	12
19	1	7	2023-06-09	16:00	10
20	1	1	2023-06-09	19:00	15
21	1	2	2023-06-09	10:00	10
22	1	3	2023-06-09	13:00	12
34	4	7	2023-06-14	17:00	16
\.


--
-- TOC entry 2687 (class 0 OID 262145)
-- Dependencies: 225
-- Data for Name: scheduleseats; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.scheduleseats (schedule_seat_id, schedule_id, seat_id) FROM stdin;
241	34	348
242	34	347
243	34	348
244	34	291
245	34	348
246	34	348
247	34	341
250	34	345
252	34	346
253	34	347
254	34	346
255	34	317
256	34	310
257	34	311
258	34	344
259	34	342
260	34	339
261	34	319
262	34	329
263	34	309
264	34	340
265	34	299
266	34	289
267	34	290
268	34	343
269	34	338
270	34	292
271	34	293
272	34	294
273	34	300
274	34	295
275	34	330
276	34	296
277	34	297
278	34	298
279	34	313
280	34	314
283	34	307
284	34	337
285	34	336
286	34	335
287	34	334
288	34	334
290	34	333
291	34	332
292	34	326
293	34	327
294	34	301
295	34	302
296	34	328
297	34	331
298	34	320
299	34	321
300	34	322
301	34	325
302	34	324
1	1	1
2	4	82
3	1	2
4	1	3
5	1	4
6	1	5
303	34	323
8	6	205
9	6	206
10	8	348
304	34	318
13	11	121
14	11	112
15	9	14
16	9	56
17	9	49
18	17	205
19	12	1
20	12	2
21	12	3
22	12	51
23	12	52
24	12	53
25	12	54
26	12	55
27	17	255
28	17	256
29	17	257
30	17	264
31	17	263
32	16	204
33	16	203
34	16	202
35	15	84
36	15	83
37	9	51
38	9	52
39	9	53
40	14	71
41	19	346
306	34	316
307	34	315
44	19	348
45	19	347
46	19	348
47	19	348
48	19	348
49	19	348
50	19	348
51	19	348
52	19	348
53	19	348
54	19	348
55	19	348
56	19	348
57	19	348
58	19	348
59	19	348
308	34	312
310	34	303
311	34	308
312	34	306
\.


--
-- TOC entry 2683 (class 0 OID 254042)
-- Dependencies: 221
-- Data for Name: seats; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.seats (seat_id, studio_id, seat_number) FROM stdin;
1	1	A1
2	1	A2
3	1	A3
4	1	A4
5	1	A5
6	1	A6
7	1	A7
8	1	A8
9	1	A9
10	1	A10
11	1	B1
12	1	B2
13	1	B3
14	1	B4
15	1	B5
16	1	B6
17	1	B7
18	1	B8
19	1	B9
20	1	B10
21	1	C1
22	1	C2
23	1	C3
24	1	C4
25	1	C5
26	1	C6
27	1	C7
28	1	C8
29	1	C9
30	1	C10
31	1	D1
32	1	D2
33	1	D3
34	1	D4
35	1	D5
36	1	D6
37	1	D7
38	1	D8
39	1	D9
40	1	D10
41	1	E1
42	1	E2
43	1	E3
44	1	E4
45	1	E5
46	1	E6
47	1	E7
48	1	E8
49	1	E9
50	1	E10
51	1	F1
52	1	F2
53	1	F3
54	1	F4
55	1	F5
56	1	F6
57	1	F7
58	1	F8
59	1	F9
60	1	F10
61	2	A1
62	2	A2
63	2	A3
64	2	A4
65	2	A5
66	2	A6
67	2	A7
68	2	A8
69	2	B1
70	2	B2
71	2	B3
72	2	B4
73	2	B5
74	2	B6
75	2	B7
76	2	B8
77	2	C1
78	2	C2
79	2	C3
80	2	C4
81	2	C5
82	2	C6
83	2	C7
84	2	C8
85	3	A1
86	3	A2
87	3	A3
88	3	A4
89	3	A5
90	3	A6
91	3	A7
92	3	A8
93	3	A9
94	3	A10
95	3	B1
96	3	B2
97	3	B3
98	3	B4
99	3	B5
100	3	B6
101	3	B7
102	3	B8
103	3	B9
104	3	B10
105	3	C1
106	3	C2
107	3	C3
108	3	C4
109	3	C5
110	3	C6
111	3	C7
112	3	C8
113	3	C9
114	3	C10
115	3	D1
116	3	D2
117	3	D3
118	3	D4
119	3	D5
120	3	D6
121	3	D7
122	3	D8
123	3	D9
124	3	D10
125	3	E1
126	3	E2
127	3	E3
128	3	E4
129	3	E5
130	3	E6
131	3	E7
132	3	E8
133	3	E9
134	3	E10
135	3	F1
136	3	F2
137	3	F3
138	3	F4
139	3	F5
140	3	F6
141	3	F7
142	3	F8
143	3	F9
144	3	F10
145	4	A1
146	4	A2
147	4	A3
148	4	A4
149	4	A5
150	4	A6
151	4	A7
152	4	A8
153	4	A9
154	4	A10
155	4	B1
156	4	B2
157	4	B3
158	4	B4
159	4	B5
160	4	B6
161	4	B7
162	4	B8
163	4	B9
164	4	B10
165	4	C1
166	4	C2
167	4	C3
168	4	C4
169	4	C5
170	4	C6
171	4	C7
172	4	C8
173	4	C9
174	4	C10
175	4	D1
176	4	D2
177	4	D3
178	4	D4
179	4	D5
180	4	D6
181	4	D7
182	4	D8
183	4	D9
184	4	D10
185	4	E1
186	4	E2
187	4	E3
188	4	E4
189	4	E5
190	4	E6
191	4	E7
192	4	E8
193	4	E9
194	4	E10
195	4	F1
196	4	F2
197	4	F3
198	4	F4
199	4	F5
200	4	F6
201	4	F7
202	4	F8
203	4	F9
204	4	F10
205	5	A1
206	5	A2
207	5	A3
208	5	A4
209	5	A5
210	5	A6
211	5	A7
212	5	A8
213	5	A9
214	5	A10
215	5	B1
216	5	B2
217	5	B3
218	5	B4
219	5	B5
220	5	B6
221	5	B7
222	5	B8
223	5	B9
224	5	B10
225	5	C1
226	5	C2
227	5	C3
228	5	C4
229	5	C5
230	5	C6
231	5	C7
232	5	C8
233	5	C9
234	5	C10
235	5	D1
236	5	D2
237	5	D3
238	5	D4
239	5	D5
240	5	D6
241	5	D7
242	5	D8
243	5	D9
244	5	D10
245	5	E1
246	5	E2
247	5	E3
248	5	E4
249	5	E5
250	5	E6
251	5	E7
252	5	E8
253	5	E9
254	5	E10
255	5	F1
256	5	F2
257	5	F3
258	5	F4
259	5	F5
260	5	F6
261	5	F7
262	5	F8
263	5	F9
264	5	F10
265	6	A1
266	6	A2
267	6	A3
268	6	A4
269	6	A5
270	6	A6
271	6	A7
272	6	A8
273	6	B1
274	6	B2
275	6	B3
276	6	B4
277	6	B5
278	6	B6
279	6	B7
280	6	B8
281	6	C1
282	6	C2
283	6	C3
284	6	C4
285	6	C5
286	6	C6
287	6	C7
288	6	C8
289	7	A1
290	7	A2
291	7	A3
292	7	A4
293	7	A5
294	7	A6
295	7	A7
296	7	A8
297	7	A9
298	7	A10
299	7	B1
300	7	B2
301	7	B3
302	7	B4
303	7	B5
304	7	B6
305	7	B7
306	7	B8
307	7	B9
308	7	B10
309	7	C1
310	7	C2
311	7	C3
312	7	C4
313	7	C5
314	7	C6
315	7	C7
316	7	C8
317	7	C9
318	7	C10
319	7	D1
320	7	D2
321	7	D3
322	7	D4
323	7	D5
324	7	D6
325	7	D7
326	7	D8
327	7	D9
328	7	D10
329	7	E1
330	7	E2
331	7	E3
332	7	E4
333	7	E5
334	7	E6
335	7	E7
336	7	E8
337	7	E9
338	7	E10
339	7	F1
340	7	F2
341	7	F3
342	7	F4
343	7	F5
344	7	F6
345	7	F7
346	7	F8
347	7	F9
348	7	F10
349	8	A1
350	8	A2
351	8	A3
352	8	A4
353	8	A5
354	8	A6
355	8	A7
356	8	A8
357	8	B1
358	8	B2
359	8	B3
360	8	B4
361	8	B5
362	8	B6
363	8	B7
364	8	B8
365	8	C1
366	8	C2
367	8	C3
368	8	C4
369	8	C5
370	8	C6
371	8	C7
372	8	C8
373	9	A1
374	9	A2
375	9	A3
376	9	A4
377	9	A5
378	9	A6
379	9	A7
380	9	A8
381	9	A9
382	9	A10
383	9	B1
384	9	B2
385	9	B3
386	9	B4
387	9	B5
388	9	B6
389	9	B7
390	9	B8
391	9	B9
392	9	B10
393	9	C1
394	9	C2
395	9	C3
396	9	C4
397	9	C5
398	9	C6
399	9	C7
400	9	C8
401	9	C9
402	9	C10
403	9	D1
404	9	D2
405	9	D3
406	9	D4
407	9	D5
408	9	D6
409	9	D7
410	9	D8
411	9	D9
412	9	D10
413	9	E1
414	9	E2
415	9	E3
416	9	E4
417	9	E5
418	9	E6
419	9	E7
420	9	E8
421	9	E9
422	9	E10
423	9	F1
424	9	F2
425	9	F3
426	9	F4
427	9	F5
428	9	F6
429	9	F7
430	9	F8
431	9	F9
432	9	F10
433	10	A1
434	10	A2
435	10	A3
436	10	A4
437	10	A5
438	10	A6
439	10	A7
440	10	A8
441	10	B1
442	10	B2
443	10	B3
444	10	B4
445	10	B5
446	10	B6
447	10	B7
448	10	B8
449	10	C1
450	10	C2
451	10	C3
452	10	C4
453	10	C5
454	10	C6
455	10	C7
456	10	C8
457	11	A1
458	11	A2
459	11	A3
460	11	A4
461	11	A5
462	11	A6
463	11	A7
464	11	A8
465	11	A9
466	11	A10
467	11	B1
468	11	B2
469	11	B3
470	11	B4
471	11	B5
472	11	B6
473	11	B7
474	11	B8
475	11	B9
476	11	B10
477	11	C1
478	11	C2
479	11	C3
480	11	C4
481	11	C5
482	11	C6
483	11	C7
484	11	C8
485	11	C9
486	11	C10
487	11	D1
488	11	D2
489	11	D3
490	11	D4
491	11	D5
492	11	D6
493	11	D7
494	11	D8
495	11	D9
496	11	D10
497	11	E1
498	11	E2
499	11	E3
500	11	E4
501	11	E5
502	11	E6
503	11	E7
504	11	E8
505	11	E9
506	11	E10
507	11	F1
508	11	F2
509	11	F3
510	11	F4
511	11	F5
512	11	F6
513	11	F7
514	11	F8
515	11	F9
516	11	F10
517	12	A1
518	12	A2
519	12	A3
520	12	A4
521	12	A5
522	12	A6
523	12	A7
524	12	A8
525	12	B1
526	12	B2
527	12	B3
528	12	B4
529	12	B5
530	12	B6
531	12	B7
532	12	B8
533	12	C1
534	12	C2
535	12	C3
536	12	C4
537	12	C5
538	12	C6
539	12	C7
540	12	C8
541	13	A1
542	13	A2
543	13	A3
544	13	A4
545	13	A5
546	13	A6
547	13	A7
548	13	A8
549	13	A9
550	13	A10
551	13	B1
552	13	B2
553	13	B3
554	13	B4
555	13	B5
556	13	B6
557	13	B7
558	13	B8
559	13	B9
560	13	B10
561	13	C1
562	13	C2
563	13	C3
564	13	C4
565	13	C5
566	13	C6
567	13	C7
568	13	C8
569	13	C9
570	13	C10
571	13	D1
572	13	D2
573	13	D3
574	13	D4
575	13	D5
576	13	D6
577	13	D7
578	13	D8
579	13	D9
580	13	D10
581	13	E1
582	13	E2
583	13	E3
584	13	E4
585	13	E5
586	13	E6
587	13	E7
588	13	E8
589	13	E9
590	13	E10
591	13	F1
592	13	F2
593	13	F3
594	13	F4
595	13	F5
596	13	F6
597	13	F7
598	13	F8
599	13	F9
600	13	F10
601	14	A1
602	14	A2
603	14	A3
604	14	A4
605	14	A5
606	14	A6
607	14	A7
608	14	A8
609	14	B1
610	14	B2
611	14	B3
612	14	B4
613	14	B5
614	14	B6
615	14	B7
616	14	B8
617	14	C1
618	14	C2
619	14	C3
620	14	C4
621	14	C5
622	14	C6
623	14	C7
624	14	C8
625	15	A1
626	15	A2
627	15	A3
628	15	A4
629	15	A5
630	15	A6
631	15	A7
632	15	A8
633	15	A9
634	15	A10
635	15	B1
636	15	B2
637	15	B3
638	15	B4
639	15	B5
640	15	B6
641	15	B7
642	15	B8
643	15	B9
644	15	B10
645	15	C1
646	15	C2
647	15	C3
648	15	C4
649	15	C5
650	15	C6
651	15	C7
652	15	C8
653	15	C9
654	15	C10
655	15	D1
656	15	D2
657	15	D3
658	15	D4
659	15	D5
660	15	D6
661	15	D7
662	15	D8
663	15	D9
664	15	D10
665	15	E1
666	15	E2
667	15	E3
668	15	E4
669	15	E5
670	15	E6
671	15	E7
672	15	E8
673	15	E9
674	15	E10
675	15	F1
676	15	F2
677	15	F3
678	15	F4
679	15	F5
680	15	F6
681	15	F7
682	15	F8
683	15	F9
684	15	F10
685	16	A1
686	16	A2
687	16	A3
688	16	A4
689	16	A5
690	16	A6
691	16	A7
692	16	A8
693	16	B1
694	16	B2
695	16	B3
696	16	B4
697	16	B5
698	16	B6
699	16	B7
700	16	B8
701	16	C1
702	16	C2
703	16	C3
704	16	C4
705	16	C5
706	16	C6
707	16	C7
708	16	C8
709	17	A1
710	17	A2
711	17	A3
712	17	A4
713	17	A5
714	17	A6
715	17	A7
716	17	A8
717	17	A9
718	17	A10
719	17	B1
720	17	B2
721	17	B3
722	17	B4
723	17	B5
724	17	B6
725	17	B7
726	17	B8
727	17	B9
728	17	B10
729	17	C1
730	17	C2
731	17	C3
732	17	C4
733	17	C5
734	17	C6
735	17	C7
736	17	C8
737	17	C9
738	17	C10
739	17	D1
740	17	D2
741	17	D3
742	17	D4
743	17	D5
744	17	D6
745	17	D7
746	17	D8
747	17	D9
748	17	D10
749	17	E1
750	17	E2
751	17	E3
752	17	E4
753	17	E5
754	17	E6
755	17	E7
756	17	E8
757	17	E9
758	17	E10
759	17	F1
760	17	F2
761	17	F3
762	17	F4
763	17	F5
764	17	F6
765	17	F7
766	17	F8
767	17	F9
768	17	F10
769	18	A1
770	18	A2
771	18	A3
772	18	A4
773	18	A5
774	18	A6
775	18	A7
776	18	A8
777	18	B1
778	18	B2
779	18	B3
780	18	B4
781	18	B5
782	18	B6
783	18	B7
784	18	B8
785	18	C1
786	18	C2
787	18	C3
788	18	C4
789	18	C5
790	18	C6
791	18	C7
792	18	C8
793	19	A1
794	19	A2
795	19	A3
796	19	A4
797	19	A5
798	19	A6
799	19	A7
800	19	A8
801	19	A9
802	19	A10
803	19	B1
804	19	B2
805	19	B3
806	19	B4
807	19	B5
808	19	B6
809	19	B7
810	19	B8
811	19	B9
812	19	B10
813	19	C1
814	19	C2
815	19	C3
816	19	C4
817	19	C5
818	19	C6
819	19	C7
820	19	C8
821	19	C9
822	19	C10
823	19	D1
824	19	D2
825	19	D3
826	19	D4
827	19	D5
828	19	D6
829	19	D7
830	19	D8
831	19	D9
832	19	D10
833	19	E1
834	19	E2
835	19	E3
836	19	E4
837	19	E5
838	19	E6
839	19	E7
840	19	E8
841	19	E9
842	19	E10
843	19	F1
844	19	F2
845	19	F3
846	19	F4
847	19	F5
848	19	F6
849	19	F7
850	19	F8
851	19	F9
852	19	F10
853	20	A1
854	20	A2
855	20	A3
856	20	A4
857	20	A5
858	20	A6
859	20	A7
860	20	A8
861	20	B1
862	20	B2
863	20	B3
864	20	B4
865	20	B5
866	20	B6
867	20	B7
868	20	B8
869	20	C1
870	20	C2
871	20	C3
872	20	C4
873	20	C5
874	20	C6
875	20	C7
876	20	C8
\.


--
-- TOC entry 2681 (class 0 OID 254035)
-- Dependencies: 219
-- Data for Name: studios; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.studios (studio_id, name, type, theater_id) FROM stdin;
1	Studio 1	Reguler	1
3	Studio 3	Reguler	1
4	Studio 1	Reguler	2
6	Studio 3	Deluxe	2
7	Studio 4	Reguler	2
5	Studio 2	Reguler	2
8	Studio 1	Deluxe	3
9	Studio 2	Reguler	3
10	Studio 3	Deluxe	3
11	Studio 1	Reguler	4
12	Studio 2	Deluxe	4
13	Studio 3	Reguler	4
14	Studio 1	Deluxe	5
15	Studio 2	Reguler	5
16	Studio 3	Deluxe	5
17	Studio 1	Reguler	6
18	Studio 2	Deluxe	6
19	Studio 3	Reguler	6
20	Studio 4	Deluxe	6
2	Studio 2	Deluxe	1
25	Studio 4	Reguler	\N
26	Studio 4	Reguler	\N
27	Studio 4	Reguler	\N
24	Studio 4	Reguler	3
\.


--
-- TOC entry 2693 (class 0 OID 401409)
-- Dependencies: 231
-- Data for Name: theaters; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.theaters (theater_id, name, address, city, theater_images) FROM stdin;
1	Grand Indonesia	Jalan M.H. Thamrin, No. 1, Jakarta	Jakarta	1685904599616 - grand-indonesia.jpg
2	Central Park Mall	Jalan Letjen S. Parman Kav. 28, Jakarta Barat	Jakarta	1685904883321 - central-park-mall.jpg
3	Gandaria City	Jl. Arteri Pd. Indah,  Jakarta Selatan	Jakarta	1685905063373 - gandaria-city.jpg
4	Paris Van Java	Jalan Sukajadi no. 131 - 139	Bandung	1685906100497 - paris-van-java.jpg
5	Summarecon Mall Bekasi	Jl. Boulevard Ahmad Yani, Marga Mulya	Bekasi	1685906284143 - summarecon-mall-bekasi.jpg
6	Plaza Ambarrukmo	Jl. Laksda Adisucipto No.80	Yogyakarta	1686042102671 - .jpg
9	teste	tes	tessssss	1686488229735 - teste.jpg
\.


--
-- TOC entry 2691 (class 0 OID 294948)
-- Dependencies: 229
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.tickets (ticket_id, transaction_id, schedule_id, seat_id) FROM stdin;
1	1	1	1
2	2	4	82
3	3	1	2
4	4	1	3
5	5	1	4
6	6	1	5
7	7	1	51
8	8	6	205
9	8	6	206
10	9	8	348
11	10	11	95
12	11	11	121
13	12	11	112
14	14	12	2
15	15	12	2
16	16	12	2
17	17	12	2
18	18	12	3
19	19	12	51
20	20	12	52
21	21	12	53
22	21	12	54
23	21	12	55
24	22	17	255
25	22	17	256
26	22	17	257
27	23	17	255
28	23	17	256
29	23	17	257
30	24	17	264
31	24	17	263
32	25	16	204
33	25	16	203
34	25	16	202
35	26	15	84
36	26	15	83
37	27	9	51
38	27	9	52
39	27	9	53
40	28	9	51
41	28	9	52
42	28	9	53
43	29	14	61
44	29	14	62
45	30	9	30
46	31	9	30
47	34	12	60
48	34	12	59
49	35	20	15
50	36	20	15
51	37	20	15
52	38	19	346
53	39	19	346
54	41	19	346
55	42	19	348
56	42	19	347
57	43	19	348
58	43	19	347
59	44	19	348
60	\N	19	348
61	46	19	348
62	47	19	348
63	48	19	348
64	49	19	348
65	50	19	348
66	51	19	348
67	\N	19	348
68	52	19	348
69	53	19	348
70	54	19	348
71	55	19	348
72	56	19	348
73	57	34	348
74	58	34	348
75	59	34	348
76	60	34	348
77	61	34	348
78	62	34	333
79	62	34	334
80	63	34	333
81	63	34	334
82	65	34	289
83	65	34	290
84	66	34	323
85	67	34	289
86	68	34	348
87	68	34	347
88	69	34	348
89	69	34	347
90	70	34	348
91	71	34	348
92	72	34	348
93	73	34	348
94	73	34	347
95	74	34	291
96	75	34	348
97	76	34	348
98	77	34	341
99	78	34	346
100	79	34	310
101	79	34	311
102	80	34	344
103	81	34	342
104	82	34	339
105	83	34	319
106	84	34	329
107	85	34	309
108	86	34	340
109	87	34	299
110	88	34	289
111	89	34	290
112	90	34	343
113	91	34	338
114	92	34	292
115	93	34	293
116	94	34	294
117	95	34	300
118	96	34	295
119	97	34	330
120	98	34	296
121	99	34	297
122	100	34	298
123	101	34	313
124	101	34	314
125	102	34	307
126	103	34	337
127	103	34	336
128	104	34	335
129	105	34	334
130	106	34	334
131	107	34	333
132	108	34	333
133	109	34	332
134	110	34	326
135	111	34	327
136	112	34	301
137	113	34	302
138	114	34	328
139	115	34	331
140	116	34	320
141	116	34	321
142	117	34	322
143	118	34	325
144	119	34	324
145	120	34	323
146	121	34	318
147	122	34	316
148	123	34	316
149	124	34	315
150	125	34	312
152	127	34	303
153	\N	34	308
154	\N	34	306
\.


--
-- TOC entry 2689 (class 0 OID 294936)
-- Dependencies: 227
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.transactions (transaction_id, user_id, quantity, transaction_status, transaction_date, payment_max_date) FROM stdin;
1	1	1	DONE	2023-06-02 00:00:00	\N
2	1	1	DONE	2023-06-04 00:00:00	\N
3	1	1	DONE	2023-06-05 00:00:00	\N
4	1	1	DONE	2023-06-05 21:29:35.137	\N
5	1	1	CANCELED	2023-06-05 21:31:36.534	\N
6	1	1	CANCELED	2023-06-05 21:41:12.162	\N
7	1	1	CANCELED	2023-06-05 21:46:42.175	\N
8	1	2	DONE	2023-06-06 02:48:31.929	\N
9	1	1	CANCELED	2023-06-06 07:43:23.916	\N
10	1	1	WAITING	2023-06-06 23:36:28.078	\N
11	1	1	DONE	2023-06-07 00:48:24.117	\N
12	1	1	WAITING	2023-06-07 00:50:21.133	\N
13	1	0	CANCELED	2023-06-07 16:11:55.725	\N
14	1	1	CANCELED	2023-06-07 16:13:32.81	\N
15	1	1	CANCELED	2023-06-07 16:23:15.992	\N
16	1	1	CANCELED	2023-06-07 16:23:33.573	\N
17	1	1	CANCELED	2023-06-07 16:23:56.066	\N
18	1	1	CANCELED	2023-06-07 16:26:37.061	\N
19	1	1	CANCELED	2023-06-07 16:39:29.339	\N
20	1	1	CANCELED	2023-06-07 16:40:02.606	\N
21	1	3	CANCELED	2023-06-07 16:40:27.352	\N
22	1	3	CANCELED	2023-06-07 16:42:28.117	\N
23	1	3	CANCELED	2023-06-07 16:42:37.443	\N
24	1	2	CANCELED	2023-06-07 16:45:22.47	\N
25	1	3	CANCELED	2023-06-07 16:47:20.276	\N
26	1	2	CANCELED	2023-06-07 16:48:57.351	\N
27	1	3	CANCELED	2023-06-07 16:51:12.392	\N
28	1	3	CANCELED	2023-06-07 16:51:18.435	\N
29	1	2	CANCELED	2023-06-07 16:51:35.013	\N
30	1	1	CANCELED	2023-06-07 18:05:21.888	\N
31	1	1	CANCELED	2023-06-07 18:06:15.499	\N
32	1	0	CANCELED	2023-06-07 23:02:34.028	\N
33	1	0	CANCELED	2023-06-07 23:02:35.442	\N
34	1	2	CANCELED	2023-06-08 07:20:32.027	\N
35	1	1	CANCELED	2023-06-08 22:51:24.715	\N
36	1	1	CANCELED	2023-06-08 22:51:29.346	\N
37	1	1	CANCELED	2023-06-08 22:51:41.664	\N
38	1	1	CANCELED	2023-06-09 14:18:55.961	\N
39	1	1	CANCELED	2023-06-09 14:20:48.627	\N
40	1	0	CANCELED	2023-06-09 14:26:20.794	\N
41	1	1	CANCELED	2023-06-09 14:26:37.515	\N
42	1	2	CANCELED	2023-06-09 14:30:17.305	\N
43	1	2	CANCELED	2023-06-09 14:31:13.804	\N
44	1	1	CANCELED	2023-06-09 14:34:08.927	\N
45	1	1	CANCELED	2023-06-09 14:37:11.98	\N
46	1	1	CANCELED	2023-06-09 14:40:07.139	\N
47	1	1	CANCELED	2023-06-09 14:43:12.352	\N
48	1	1	CANCELED	2023-06-09 14:47:47.484	\N
49	1	1	CANCELED	2023-06-09 21:49:11.796	\N
50	1	1	CANCELED	2023-06-09 21:56:49.162	\N
51	1	1	CANCELED	2023-06-09 21:57:34.501	\N
52	1	1	CANCELED	2023-06-09 22:22:07.546	2023-06-09 22:22:07.546
53	1	1	CANCELED	2023-06-09 22:25:09.596	2023-06-09 22:25:09.596
54	1	1	CANCELED	2023-06-09 22:38:12.879	2023-06-09 22:38:12.879
55	1	1	CANCELED	2023-06-09 22:41:03.667	2023-06-09 22:41:03.667
56	1	1	CANCELED	2023-06-09 22:43:11.76	2023-06-09 22:43:11.76
57	1	1	CANCELED	2023-06-10 04:08:05.461	2023-06-10 04:08:05.461
58	1	1	CANCELED	2023-06-09 21:10:27.784	2023-06-09 21:10:27.784
59	1	1	CANCELED	2023-06-09 21:03:17.899	2023-06-09 21:13:17.899
60	1	1	WAITING	2023-06-09 21:14:49.615	2023-06-09 21:24:49.615
61	1	1	WAITING	2023-06-09 22:13:46.654	2023-06-09 22:23:46.654
62	1	2	WAITING	2023-06-09 23:27:48.629	2023-06-09 23:37:48.629
63	1	2	WAITING	2023-06-09 23:27:49.967	2023-06-09 23:37:49.967
64	1	0	WAITING	2023-06-09 23:28:05.727	2023-06-09 23:38:05.727
65	1	2	DONE	2023-06-10 00:50:53.761	2023-06-10 01:00:53.761
66	1	1	DONE	2023-06-10 00:54:21.264	2023-06-10 01:04:21.264
67	1	1	DONE	2023-06-10 01:19:59.839	2023-06-10 01:29:59.839
68	1	2	DONE	2023-06-10 01:44:38.364	2023-06-10 01:54:38.364
69	1	2	DONE	2023-06-10 01:46:02.037	2023-06-10 01:56:02.037
70	1	1	DONE	2023-06-10 02:00:02.924	2023-06-10 02:10:02.924
71	1	1	DONE	2023-06-10 02:12:13.348	2023-06-10 02:22:13.348
72	1	1	DONE	2023-06-10 02:18:27.209	2023-06-10 02:28:27.209
73	1	2	DONE	2023-06-10 02:24:32.403	2023-06-10 02:34:32.403
74	1	1	DONE	2023-06-10 02:26:05.145	2023-06-10 02:36:05.145
75	1	1	DONE	2023-06-10 02:27:01.897	2023-06-10 02:37:01.897
76	1	1	DONE	2023-06-10 02:28:31.43	2023-06-10 02:38:31.43
77	1	1	DONE	2023-06-10 02:44:59.616	2023-06-10 02:54:59.616
78	1	1	DONE	2023-06-10 02:51:40.394	2023-06-10 03:01:40.394
79	1	2	DONE	2023-06-10 03:37:26.066	2023-06-10 03:47:26.066
80	1	1	WAITING	2023-06-10 04:00:20.059	2023-06-10 04:10:20.059
81	1	1	WAITING	2023-06-10 04:36:35.078	2023-06-10 04:46:35.078
82	1	1	DONE	2023-06-10 04:52:31.346	2023-06-10 05:02:31.346
83	1	1	WAITING	2023-06-10 04:53:13.98	2023-06-10 05:03:13.98
84	1	1	WAITING	2023-06-10 04:55:23.745	2023-06-10 05:05:23.745
85	1	1	WAITING	2023-06-10 04:57:29.254	2023-06-10 05:07:29.254
86	1	1	WAITING	2023-06-10 05:00:23.371	2023-06-10 05:10:23.371
87	1	1	WAITING	2023-06-10 05:04:15.395	2023-06-10 05:14:15.395
88	1	1	WAITING	2023-06-10 05:05:36.114	2023-06-10 05:15:36.114
89	1	1	WAITING	2023-06-10 05:09:51.521	2023-06-10 05:19:51.521
90	1	1	DONE	2023-06-10 10:07:42.914	2023-06-10 10:17:42.914
91	1	1	DONE	2023-06-10 10:32:46.416	2023-06-10 10:42:46.416
92	1	1	DONE	2023-06-10 10:34:15.123	2023-06-10 10:44:15.123
93	1	1	DONE	2023-06-10 10:35:59.036	2023-06-10 10:45:59.036
94	1	1	WAITING	2023-06-10 10:43:59.999	2023-06-10 10:53:59.999
95	1	1	WAITING	2023-06-10 12:31:07.307	2023-06-10 12:41:07.307
96	1	1	WAITING	2023-06-10 12:32:28.204	2023-06-10 12:42:28.204
97	1	1	WAITING	2023-06-10 12:40:37.961	2023-06-10 12:50:37.961
99	1	1	DONE	2023-06-10 12:48:06.729	2023-06-10 12:58:06.729
100	1	1	DONE	2023-06-10 12:52:22.603	2023-06-10 13:02:22.603
98	1	1	DONE	2023-06-10 12:42:14.62	2023-06-10 12:52:14.62
101	1	2	DONE	2023-06-10 15:19:52.136	2023-06-10 15:29:52.136
102	1	1	DONE	2023-06-10 19:27:10.285	2023-06-10 19:37:10.285
103	1	2	DONE	2023-06-10 21:00:32.277	2023-06-10 21:10:32.277
104	1	1	DONE	2023-06-10 23:46:28.839	2023-06-10 23:56:28.839
105	1	1	WAITING	2023-06-10 23:57:15.285	2023-06-11 00:07:15.285
106	1	1	DONE	2023-06-10 23:57:18.616	2023-06-11 00:07:18.616
107	1	1	CANCELED	2023-06-11 00:09:29.681	2023-06-11 00:19:29.681
108	1	1	DONE	2023-06-11 00:10:06.111	2023-06-11 00:20:06.111
109	1	1	DONE	2023-06-11 00:14:54.06	2023-06-11 00:24:54.06
110	1	1	DONE	2023-06-11 00:23:12.954	2023-06-11 00:33:12.954
111	1	1	DONE	2023-06-11 00:26:26.365	2023-06-11 00:36:26.365
112	1	1	DONE	2023-06-11 00:34:15.497	2023-06-11 00:44:15.497
113	1	1	DONE	2023-06-11 00:37:29.264	2023-06-11 00:47:29.264
114	1	1	DONE	2023-06-11 00:43:40.128	2023-06-11 00:53:40.128
115	1	1	DONE	2023-06-11 00:45:51.524	2023-06-11 00:55:51.524
116	1	2	DONE	2023-06-11 00:52:09.009	2023-06-11 01:02:09.009
117	1	1	DONE	2023-06-11 00:53:40.365	2023-06-11 01:03:40.365
118	1	1	DONE	2023-06-11 00:54:51.701	2023-06-11 01:04:51.701
119	1	1	DONE	2023-06-11 00:55:54.347	2023-06-11 01:05:54.347
120	1	1	DONE	2023-06-11 01:02:54.792	2023-06-11 01:12:54.792
121	1	1	DONE	2023-06-11 10:11:04.951	2023-06-11 10:21:04.951
122	1	1	CANCELED	2023-06-11 10:28:20.06	2023-06-11 10:38:20.06
123	1	1	DONE	2023-06-11 10:33:57.071	2023-06-11 10:43:57.071
124	1	1	DONE	2023-06-11 10:35:40.587	2023-06-11 10:45:40.587
125	1	1	DONE	2023-06-11 10:37:11.48	2023-06-11 10:47:11.48
127	1	1	DONE	2023-06-11 15:46:15.749	2023-06-11 15:56:15.749
128	6	2	DONE	2023-06-11 19:45:14.933	2023-06-11 19:55:14.933
\.


--
-- TOC entry 2679 (class 0 OID 204854)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: rroiii
--

COPY public.users (user_id, username, email, password, first_name, last_name, phone_number, points) FROM stdin;
1	royoswaldha	tes@gmail.com	$2b$10$d1jV/ee86xU1qE5.uFwkeeOXES4fQyMxYK2w2MgNVdqaN79FuK6LG	Roy	Oswaldha	9999	0
3	handaneswari13	handa@gmail.com	$2b$10$zyuZI3JGDK0lq3fijZ5Ptucp1Z9NJwRMjs.h47Ld6ssM6wtcGaPoq	Handaneswari	Pramudhyta	0812121121	0
4	imanda13	testtest@gmail.com	$2b$10$3/V1v4mAc12RI/TEMbWmZewIQwpCtlTt3.7rKMy5L91uL8zqlXYtO	Handa	Imanda	0812319129	0
5	rafieamandio	rafie@gmail.com	$2b$10$lvjkVXtu8EzZBGwYI8vsJeQZ5DArwT9H5m8YChja9uC9KnuGj5ptG	rafie	amandio	012817217	0
6	royoswaldha2	tes2@gmail.com	$2b$10$oB7dxB6VeZD3idzx..0uFel6kJcLHnIZVqYd.UHOcbVHvRYvFZ2jy	Roy	Oswaldha	12345678	0
\.


--
-- TOC entry 2717 (class 0 OID 0)
-- Dependencies: 234
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 2, true);


--
-- TOC entry 2718 (class 0 OID 0)
-- Dependencies: 214
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 19, true);


--
-- TOC entry 2719 (class 0 OID 0)
-- Dependencies: 239
-- Name: payout_payout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.payout_payout_id_seq', 14, true);


--
-- TOC entry 2720 (class 0 OID 0)
-- Dependencies: 232
-- Name: remember_me_tokens_remember_me_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.remember_me_tokens_remember_me_tokens_id_seq', 24, true);


--
-- TOC entry 2721 (class 0 OID 0)
-- Dependencies: 222
-- Name: schedule_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.schedule_schedule_id_seq', 34, true);


--
-- TOC entry 2722 (class 0 OID 0)
-- Dependencies: 224
-- Name: scheduleseats_schedule_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.scheduleseats_schedule_seat_id_seq', 312, true);


--
-- TOC entry 2723 (class 0 OID 0)
-- Dependencies: 220
-- Name: seats_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.seats_seat_id_seq', 879, true);


--
-- TOC entry 2724 (class 0 OID 0)
-- Dependencies: 218
-- Name: studios_studio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.studios_studio_id_seq', 28, true);


--
-- TOC entry 2725 (class 0 OID 0)
-- Dependencies: 230
-- Name: theaters_theater_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.theaters_theater_id_seq', 9, true);


--
-- TOC entry 2726 (class 0 OID 0)
-- Dependencies: 228
-- Name: tickets_ticket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.tickets_ticket_id_seq', 154, true);


--
-- TOC entry 2727 (class 0 OID 0)
-- Dependencies: 226
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 128, true);


--
-- TOC entry 2728 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rroiii
--

SELECT pg_catalog.setval('public.users_user_id_seq', 6, true);


--
-- TOC entry 2510 (class 2606 OID 450572)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 2512 (class 2606 OID 450568)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 2514 (class 2606 OID 450570)
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- TOC entry 2484 (class 2606 OID 204838)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- TOC entry 2516 (class 2606 OID 466954)
-- Name: payout payout_payout_link_key; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.payout
    ADD CONSTRAINT payout_payout_link_key UNIQUE (payout_link);


--
-- TOC entry 2518 (class 2606 OID 466952)
-- Name: payout payout_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.payout
    ADD CONSTRAINT payout_pkey PRIMARY KEY (payout_id);


--
-- TOC entry 2508 (class 2606 OID 417798)
-- Name: remember_me_tokens remember_me_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.remember_me_tokens
    ADD CONSTRAINT remember_me_tokens_pkey PRIMARY KEY (remember_me_tokens_id);


--
-- TOC entry 2498 (class 2606 OID 254059)
-- Name: schedule schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pkey PRIMARY KEY (schedule_id);


--
-- TOC entry 2500 (class 2606 OID 262150)
-- Name: scheduleseats scheduleseats_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.scheduleseats
    ADD CONSTRAINT scheduleseats_pkey PRIMARY KEY (schedule_seat_id);


--
-- TOC entry 2496 (class 2606 OID 254047)
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (seat_id);


--
-- TOC entry 2494 (class 2606 OID 254040)
-- Name: studios studios_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.studios
    ADD CONSTRAINT studios_pkey PRIMARY KEY (studio_id);


--
-- TOC entry 2506 (class 2606 OID 401416)
-- Name: theaters theaters_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.theaters
    ADD CONSTRAINT theaters_pkey PRIMARY KEY (theater_id);


--
-- TOC entry 2504 (class 2606 OID 294953)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticket_id);


--
-- TOC entry 2502 (class 2606 OID 294941)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 2486 (class 2606 OID 204863)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2488 (class 2606 OID 204865)
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- TOC entry 2490 (class 2606 OID 204859)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2492 (class 2606 OID 204861)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 2673 (class 2618 OID 458755)
-- Name: transactions_with_tickets _RETURN; Type: RULE; Schema: public; Owner: rroiii
--

CREATE OR REPLACE VIEW public.transactions_with_tickets AS
 SELECT t.transaction_id,
    t.user_id,
    t.quantity,
    t.transaction_status,
    t.transaction_date,
    t.payment_max_date,
    array_agg(ti.ticket_id) AS ticket_ids,
    ti.schedule_id,
    array_agg(ti.seat_id) AS seats_ids
   FROM (public.transactions t
     JOIN public.tickets ti ON ((ti.transaction_id = t.transaction_id)))
  GROUP BY t.transaction_id, ti.schedule_id;


--
-- TOC entry 2523 (class 2606 OID 262151)
-- Name: scheduleseats fk_schedule; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.scheduleseats
    ADD CONSTRAINT fk_schedule FOREIGN KEY (schedule_id) REFERENCES public.schedule(schedule_id);


--
-- TOC entry 2524 (class 2606 OID 262156)
-- Name: scheduleseats fk_seat; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.scheduleseats
    ADD CONSTRAINT fk_seat FOREIGN KEY (seat_id) REFERENCES public.seats(seat_id);


--
-- TOC entry 2530 (class 2606 OID 466955)
-- Name: payout payout_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.payout
    ADD CONSTRAINT payout_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- TOC entry 2529 (class 2606 OID 417799)
-- Name: remember_me_tokens remember_me_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.remember_me_tokens
    ADD CONSTRAINT remember_me_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 2521 (class 2606 OID 254060)
-- Name: schedule schedule_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- TOC entry 2522 (class 2606 OID 254065)
-- Name: schedule schedule_studio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_studio_id_fkey FOREIGN KEY (studio_id) REFERENCES public.studios(studio_id);


--
-- TOC entry 2520 (class 2606 OID 254048)
-- Name: seats seats_studio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_studio_id_fkey FOREIGN KEY (studio_id) REFERENCES public.studios(studio_id);


--
-- TOC entry 2519 (class 2606 OID 409600)
-- Name: studios studios_theater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.studios
    ADD CONSTRAINT studios_theater_id_fkey FOREIGN KEY (theater_id) REFERENCES public.theaters(theater_id);


--
-- TOC entry 2526 (class 2606 OID 294964)
-- Name: tickets tickets_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedule(schedule_id);


--
-- TOC entry 2527 (class 2606 OID 294969)
-- Name: tickets tickets_seat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES public.seats(seat_id);


--
-- TOC entry 2528 (class 2606 OID 294954)
-- Name: tickets tickets_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- TOC entry 2525 (class 2606 OID 294942)
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rroiii
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2023-06-11 21:42:12

--
-- PostgreSQL database dump complete
--


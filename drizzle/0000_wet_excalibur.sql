CREATE TABLE "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"street" varchar DEFAULT '' NOT NULL,
	"barangay" varchar NOT NULL,
	"city" varchar NOT NULL,
	"province" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent" (
	"id" integer PRIMARY KEY NOT NULL,
	"about" text,
	"credentials" text
);
--> statement-breakpoint
CREATE TABLE "buyer" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lease_transaction" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing" (
	"id" serial PRIMARY KEY NOT NULL,
	"agent_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"status" varchar NOT NULL,
	"date_created" timestamp with time zone DEFAULT now() NOT NULL,
	"date_modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer" (
	"id" serial PRIMARY KEY NOT NULL,
	"buyer_id" integer NOT NULL,
	"listing_id" integer NOT NULL,
	"date_created" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" varchar NOT NULL,
	"category" text NOT NULL,
	"address_id" integer NOT NULL,
	"land_area" integer NOT NULL,
	"floor_area" integer,
	"bedrooms" integer,
	"bathrooms" integer,
	"car_space" integer,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_feature" (
	"property_id" integer NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "property_feature_property_id_name_pk" PRIMARY KEY("property_id","name")
);
--> statement-breakpoint
CREATE TABLE "property_tag" (
	"property_id" integer NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "property_tag_property_id_name_pk" PRIMARY KEY("property_id","name")
);
--> statement-breakpoint
CREATE TABLE "rent_transaction" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sale_transaction" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer NOT NULL,
	"date_created" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"address_id" integer NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"profile_picture" varchar,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"birth_date" date NOT NULL,
	"mobile_number" varchar(14) NOT NULL,
	"date_created" date DEFAULT now() NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "agent" ADD CONSTRAINT "agent_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buyer" ADD CONSTRAINT "buyer_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lease_transaction" ADD CONSTRAINT "lease_transaction_id_transaction_id_fk" FOREIGN KEY ("id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_buyer_id_buyer_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."buyer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_feature" ADD CONSTRAINT "property_feature_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_tag" ADD CONSTRAINT "property_tag_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_transaction" ADD CONSTRAINT "rent_transaction_id_transaction_id_fk" FOREIGN KEY ("id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_transaction" ADD CONSTRAINT "sale_transaction_id_transaction_id_fk" FOREIGN KEY ("id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_offer_id_offer_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_usersession_user_id" ON "user_session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_email" ON "user" USING btree ("email");
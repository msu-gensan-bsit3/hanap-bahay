CREATE TABLE "photos_url" (
	"property_id" integer NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "photos_url_property_id_url_pk" PRIMARY KEY("property_id","url")
);
--> statement-breakpoint
ALTER TABLE "photos_url" ADD CONSTRAINT "photos_url_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
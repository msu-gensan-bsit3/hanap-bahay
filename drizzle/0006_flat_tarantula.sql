CREATE TABLE "seller" (
	"id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listing" ALTER COLUMN "status" SET DEFAULT 'under-review';--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "seller_id" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "seller" ADD CONSTRAINT "seller_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_seller_id_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
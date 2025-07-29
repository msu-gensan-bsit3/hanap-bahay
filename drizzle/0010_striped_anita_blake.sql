ALTER TABLE "offer_conversation" DROP CONSTRAINT "offer_conversation_offer_id_offer_id_fk";
--> statement-breakpoint
ALTER TABLE "offer_conversation" ADD CONSTRAINT "offer_conversation_offer_id_offer_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offer"("id") ON DELETE cascade ON UPDATE no action;
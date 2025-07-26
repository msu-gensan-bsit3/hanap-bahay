CREATE TABLE "offer_conversation" (
	"conversation_id" integer NOT NULL,
	"offer_id" integer NOT NULL,
	CONSTRAINT "offer_conversation_conversation_id_offer_id_pk" PRIMARY KEY("conversation_id","offer_id")
);
--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_offer_id_offer_id_fk";
--> statement-breakpoint
ALTER TABLE "conversation_participant" ALTER COLUMN "last_read_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "offer_conversation" ADD CONSTRAINT "offer_conversation_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_conversation" ADD CONSTRAINT "offer_conversation_offer_id_offer_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" DROP COLUMN "offer_id";
import { relations } from "drizzle-orm";
import {
	date,
	index,
	integer,
	json,
	numeric,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
	type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { propertyCategory } from "../services/property/type";

export const session = pgTable(
	"user_session",
	{
		id: text().primaryKey(),
		userId: integer()
			.notNull()
			.references(() => user.id),
		expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
	},
	(t) => [index("idx_usersession_user_id").on(t.userId)],
);

export const user = pgTable(
	"user",
	{
		id: serial().primaryKey(),
		addressId: integer()
			.notNull()
			.references(() => address.id),
		firstName: varchar().notNull(),
		lastName: varchar().notNull(),
		email: varchar().unique().notNull(),
		profilePicture: varchar(),
		username: text().notNull().unique(),
		passwordHash: text().notNull(),
		birthDate: date({ mode: "date" }).notNull(),
		mobileNumber: varchar({ length: 14 }).notNull(),
		dateCreated: date({ mode: "date" }).notNull().defaultNow(),

		status: text({ enum: ["ACTIVE", "DELETED", "DEACTIVATED"] })
			.notNull()
			.default("ACTIVE"),
	},
	(t) => [uniqueIndex("idx_user_email").on(t.email)],
);
export const userQuery = {
	columns: { passwordHash: false, addressId: false },
	with: {
		address: true,
	},
} as const;

export const agent = pgTable("agent", {
	id: integer()
		.primaryKey()
		.references(() => user.id),
	about: text(),
	credentials: text(),
	prcLicenceNumber: varchar(),
	// TODO:
});
export const agentQuery = {
	columns: { id: false },
	with: {
		user: userQuery,
	},
} as const;

export const buyer = pgTable("buyer", {
	id: integer()
		.primaryKey()
		.references(() => user.id),
});
export const buyerQuery = {
	columns: { id: false },
	with: {
		user: userQuery,
	},
} as const;

export const seller = pgTable("seller", {
	id: integer()
		.primaryKey()
		.references(() => user.id),
});
export const sellerQuery = {
	columns: { id: false },
	with: {
		user: userQuery,
	},
} as const;

export const propertyFeature = pgTable(
	"property_feature",
	{
		propertyId: integer()
			.notNull()
			.references(() => property.id),
		name: varchar().notNull(),
	},
	(t) => [primaryKey({ columns: [t.propertyId, t.name] })],
);
export const propertyFeatureQuery = { columns: { name: true } } as const;

export const propertyTag = pgTable(
	"property_tag",
	{
		propertyId: integer()
			.notNull()
			.references(() => property.id),
		name: varchar().notNull(),
	},
	(t) => [primaryKey({ columns: [t.propertyId, t.name] })],
);
export const propertyTagQuery = { columns: { name: true } } as const;

export const photosUrl = pgTable(
	"photos_url",
	{
		propertyId: integer()
			.notNull()
			.references(() => property.id),
		url: text().notNull(),
	},
	(t) => [primaryKey({ columns: [t.propertyId, t.url] })],
);
export const property = pgTable("property", {
	id: serial().primaryKey(),
	name: text().notNull(),
	description: text(),
	type: varchar({ enum: ["rent", "sale", "lease"] }).notNull(),
	createdAt: date({ mode: "date" }),
	sellerId: integer()
		.notNull()
		.default(0)
		.references(() => user.id),
	category: text({
		enum: [
			...propertyCategory.commercial,
			...propertyCategory.residential,
			...propertyCategory.land,
		],
	}).notNull(),
	addressId: integer()
		.notNull()
		.references(() => address.id),
	landArea: numeric({ mode: "number" }).notNull(), // In sq.meters
	floorArea: numeric({ mode: "number" }), // In sq.meters
	location: json(),
	bedrooms: integer(),
	bathrooms: integer(),
	carSpace: integer(),
	price: integer().notNull(),
});
export const photosUrlQuery = { columns: { url: true } } as const;

export const propertyQuery = {
	columns: {
		addressId: false,
		userId: false,
	},
	with: {
		features: propertyFeatureQuery,
		tags: propertyTagQuery,
		address: true,
		photosUrl: photosUrlQuery,
	},
} as const;

export const listing = pgTable("listing", {
	id: serial().primaryKey(),
	agentId: integer()
		.notNull()
		.references(() => agent.id),
	propertyId: integer()
		.notNull()
		.references(() => property.id),
	status: varchar({ enum: ["up", "pending", "sold", "under-review", "submitted"] })
		.notNull()
		.default("submitted"),
	dateCreated: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
	dateModified: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
});
export const listingQuery = {
	columns: {
		propertyId: false,
		agentId: false,
	},
	with: {
		property: propertyQuery,
		agent: agentQuery,
	},
} as const;

export const offer = pgTable("offer", {
	id: serial().primaryKey(),
	buyerId: integer()
		.notNull()
		.references(() => buyer.id),
	listingId: integer()
		.notNull()
		.references(() => listing.id),
	dateCreated: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
	status: varchar({ enum: ["completed", "rejected", "in negotiation", "new", "cancelled"] })
		.notNull()
		.default("new"),
});
export const offerQuery = {
	columns: {
		buyerId: false,
		listingId: false,
	},
	with: {
		buyer: buyerQuery,
		listing: listingQuery,
	},
} as const;

export const transaction = pgTable("transaction", {
	id: serial().primaryKey(),
	offerId: integer()
		.notNull()
		.references(() => offer.id),
	dateCreated: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
});
export const transactionQuery = {
	columns: {
		offerId: false,
	},
	with: {
		offer: offerQuery,
	},
} as const;

export const rentTransaction = pgTable("rent_transaction", {
	id: integer()
		.primaryKey()
		.references(() => transaction.id),
});

export const saleTransaction = pgTable("sale_transaction", {
	id: integer()
		.primaryKey()
		.references(() => transaction.id),
});

export const leaseTransaction = pgTable("lease_transaction", {
	id: integer()
		.primaryKey()
		.references(() => transaction.id),
});

// TODO: Improve address
export const address = pgTable("address", {
	id: serial().primaryKey(),
	street: varchar().notNull().default(""),
	barangay: varchar().notNull(),
	city: varchar().notNull(),
	province: varchar().notNull(),
});

// Messaging tables
export const conversation = pgTable("conversation", {
	id: serial().primaryKey(),
	title: varchar(),
	type: varchar({ enum: ["direct", "group"] })
		.notNull()
		.default("direct"),
	createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
});
export const conversationQuery = {
	with: {
		participants: {
			columns: { conversationId: false, userId: false },
			with: {
				user: userQuery,
			},
		},
		messages: {
			// limit: 1,
			columns: { conversationId: false },
			with: {
				reactions: {
					columns: { messageId: false },
				},
			},
		},
	},
} as const;

export const offerConversation = pgTable(
	"offer_conversation",
	{
		conversationId: integer()
			.notNull()
			.references(() => conversation.id, { onDelete: "cascade" }),
		offerId: integer()
			.notNull()
			.references(() => offer.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.conversationId, t.offerId] })],
);

export const conversationParticipant = pgTable(
	"conversation_participant",
	{
		id: serial().primaryKey(),
		conversationId: integer()
			.notNull()
			.references(() => conversation.id, { onDelete: "cascade" }),
		userId: integer()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		joinedAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
		lastReadAt: timestamp({ withTimezone: true, mode: "date" }).defaultNow(),
		role: varchar({ enum: ["admin", "member"] })
			.notNull()
			.default("member"),
	},
	(t) => [
		index("idx_conversation_participant_conversation").on(t.conversationId),
		index("idx_conversation_participant_user").on(t.userId),
		uniqueIndex("idx_conversation_participant_unique").on(t.conversationId, t.userId),
	],
);
export const conversationParticipantQuery = {
	columns: { conversationId: false, userId: false },
	with: {
		user: userQuery,
		conversation: conversationQuery,
	},
} as const;

export const message = pgTable(
	"message",
	{
		id: serial().primaryKey(),
		conversationId: integer()
			.notNull()
			.references(() => conversation.id, { onDelete: "cascade" }),
		senderId: integer()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		content: text().notNull(),
		messageType: varchar({ enum: ["text", "image", "file", "system"] })
			.notNull()
			.default("text"),
		attachmentUrl: varchar(),
		replyToId: integer().references((): AnyPgColumn => message.id),
		createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
		updatedAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
		isEdited: text({ enum: ["true", "false"] })
			.notNull()
			.default("false"),
		isDeleted: text({ enum: ["true", "false"] })
			.notNull()
			.default("false"),
	},
	(t) => [
		index("idx_message_conversation").on(t.conversationId),
		index("idx_message_sender").on(t.senderId),
		index("idx_message_created_at").on(t.createdAt),
	],
);
export const messageQuery = {
	columns: {
		senderId: false,
	},
	with: {
		reactions: {
			columns: { messageId: false },
		},
		sender: userQuery,
	},
} as const;

export const messageReaction = pgTable(
	"message_reaction",
	{
		id: serial().primaryKey(),
		messageId: integer()
			.notNull()
			.references(() => message.id, { onDelete: "cascade" }),
		userId: integer()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		emoji: varchar().notNull(),
		createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
	},
	(t) => [
		index("idx_message_reaction_message").on(t.messageId),
		uniqueIndex("idx_message_reaction_unique").on(t.messageId, t.userId, t.emoji),
	],
);

export const UserRelation = relations(user, ({ one, many }) => ({
	address: one(address, { fields: [user.addressId], references: [address.id] }),
	agent: one(agent),
	buyer: one(buyer),
	seller: one(seller),
	conversationParticipants: many(conversationParticipant, { relationName: "cpu" }),
	sentMessages: many(message),
	messageReactions: many(messageReaction),
	session: many(session),
}));

export const AgentRelation = relations(agent, ({ one, many }) => ({
	user: one(user, { fields: [agent.id], references: [user.id] }),
	listings: many(listing),
}));

export const BuyerRelation = relations(buyer, ({ one, many }) => ({
	user: one(user, { fields: [buyer.id], references: [user.id] }),
	offers: many(offer),
}));

export const SellerRelation = relations(seller, ({ one, many }) => ({
	user: one(user, { fields: [seller.id], references: [user.id] }),
	properties: many(property),
}));

export const PropertyRelation = relations(property, ({ one, many }) => ({
	address: one(address, { fields: [property.addressId], references: [address.id] }),
	features: many(propertyFeature),
	tags: many(propertyTag),
	listing: one(listing),
	photosUrl: many(photosUrl),
	seller: one(seller, { fields: [property.sellerId], references: [seller.id] }),
}));

export const PhotosUrlRelation = relations(photosUrl, ({ one }) => ({
	property: one(property, { fields: [photosUrl.propertyId], references: [property.id] }),
}));

export const PropertyFeatureRelation = relations(propertyFeature, ({ one }) => ({
	property: one(property, { fields: [propertyFeature.propertyId], references: [property.id] }),
}));

export const PropertyTagRelation = relations(propertyTag, ({ one }) => ({
	property: one(property, { fields: [propertyTag.propertyId], references: [property.id] }),
}));

export const ListingRelation = relations(listing, ({ one, many }) => ({
	agent: one(agent, { fields: [listing.agentId], references: [agent.id] }),
	property: one(property, { fields: [listing.propertyId], references: [property.id] }),
	offers: many(offer),
}));

export const OfferRelation = relations(offer, ({ one, many }) => ({
	listing: one(listing, { fields: [offer.listingId], references: [listing.id] }),
	buyer: one(buyer, { fields: [offer.buyerId], references: [buyer.id] }),
	offerConversations: many(offerConversation, { relationName: "oco" }),
}));

export const TransactionRelation = relations(transaction, ({ one }) => ({
	offer: one(offer, { fields: [transaction.id], references: [offer.id] }),
	rentTransaction: one(rentTransaction),
	saleTransaction: one(saleTransaction),
	leaseTransaction: one(leaseTransaction),
}));

export const RentTransactionRelation = relations(rentTransaction, ({ one }) => ({
	transaction: one(transaction, { fields: [rentTransaction.id], references: [transaction.id] }),
}));

export const SaleTransactionRelation = relations(saleTransaction, ({ one }) => ({
	transaction: one(transaction, { fields: [saleTransaction.id], references: [transaction.id] }),
}));

export const LeaseTransactionRelation = relations(leaseTransaction, ({ one }) => ({
	transaction: one(transaction, { fields: [leaseTransaction.id], references: [transaction.id] }),
}));

export const AddressRelation = relations(address, ({ many }) => ({
	users: many(user),
	properties: many(property),
}));

// Messaging relations
export const ConversationRelation = relations(conversation, ({ many }) => ({
	participants: many(conversationParticipant, { relationName: "cpp" }),
	messages: many(message),
	offerConversations: many(offerConversation, { relationName: "occ" }),
}));

export const OfferConversationRelation = relations(offerConversation, ({ one }) => ({
	offer: one(offer, {
		fields: [offerConversation.offerId],
		references: [offer.id],
		relationName: "oco",
	}),
	conversation: one(conversation, {
		fields: [offerConversation.conversationId],
		references: [conversation.id],
		relationName: "occ",
	}),
}));

export const ConversationParticipantRelation = relations(conversationParticipant, ({ one }) => ({
	conversation: one(conversation, {
		fields: [conversationParticipant.conversationId],
		references: [conversation.id],
		relationName: "cpp",
	}),
	user: one(user, {
		fields: [conversationParticipant.userId],
		references: [user.id],
		relationName: "cpu",
	}),
}));

export const MessageRelation = relations(message, ({ one, many }) => ({
	conversation: one(conversation, {
		fields: [message.conversationId],
		references: [conversation.id],
	}),
	sender: one(user, {
		fields: [message.senderId],
		references: [user.id],
	}),
	replyTo: one(message, {
		fields: [message.replyToId],
		references: [message.id],
	}),
	reactions: many(messageReaction),
}));

export const MessageReactionRelation = relations(messageReaction, ({ one }) => ({
	message: one(message, {
		fields: [messageReaction.messageId],
		references: [message.id],
	}),
	user: one(user, {
		fields: [messageReaction.userId],
		references: [user.id],
	}),
}));

export const UserSessionRelation = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.id], references: [user.id] }),
}));

export type User = typeof user.$inferSelect;
export type Agent = typeof agent.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Address = typeof address.$inferSelect;
export type Property = typeof property.$inferSelect;
export type Conversation = typeof conversation.$inferSelect;
export type ConversationParticipant = typeof conversationParticipant.$inferSelect;
export type Message = typeof message.$inferSelect;
export type MessageReaction = typeof messageReaction.$inferSelect;

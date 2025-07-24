import { relations } from 'drizzle-orm';
import {
	date,
	index,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core';
import { propertyCategory } from '../services/property/type';

export const session = pgTable(
	'user_session',
	{
		id: text().primaryKey(),
		userId: integer()
			.notNull()
			.references(() => user.id),
		expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull()
	},
	(t) => [index('idx_usersession_user_id').on(t.userId)]
);

export const user = pgTable(
	'user',
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
		birthDate: date().notNull(),
		mobileNumber: varchar({ length: 14 }).notNull(),
		dateCreated: date().notNull().defaultNow(),

		status: text({ enum: ['ACTIVE', 'DELETED', 'DEACTIVATED'] })
			.notNull()
			.default('ACTIVE')
	},
	(t) => [uniqueIndex('idx_user_email').on(t.email)]
);

export const agent = pgTable('agent', {
	id: integer()
		.primaryKey()
		.references(() => user.id),
	description: text()
});

export const buyer = pgTable('buyer', {
	id: integer()
		.primaryKey()
		.references(() => user.id)
});

export const property = pgTable('property', {
	id: serial().primaryKey(),
	name: text().notNull(),
	description: text().notNull(),
	type: varchar({ enum: ['rent', 'sale', 'lease'] }).notNull(),
	category: text({
		enum: [
			...propertyCategory.commercial,
			...propertyCategory.residential,
			...propertyCategory.land
		]
	}).notNull(),
	addressId: integer()
		.notNull()
		.references(() => address.id),
	landArea: integer().notNull(), // In sq.meters
	floorArea: integer(), // In sq.meters
	bedroom: integer(),
	bathroom: integer(),
	carSpace: integer(),
	price: integer().notNull()
});

export const propertyFeature = pgTable(
	'property_feature',
	{
		propertyId: integer()
			.notNull()
			.references(() => property.id),
		name: varchar().notNull()
	},
	(t) => [primaryKey({ columns: [t.propertyId, t.name] })]
);

export const propertyTag = pgTable(
	'property_tag',
	{
		propertyId: integer()
			.notNull()
			.references(() => property.id),
		name: varchar().notNull()
	},
	(t) => [primaryKey({ columns: [t.propertyId, t.name] })]
);

export const listing = pgTable('listing', {
	id: serial().primaryKey(),
	agentId: integer()
		.notNull()
		.references(() => agent.id),
	propertyId: integer()
		.notNull()
		.references(() => property.id),
	status: varchar({ enum: ['up', 'pending', 'sold'] }).notNull(),
	dateCreated: timestamp({ withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	dateModified: timestamp({ withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const offer = pgTable('offer', {
	id: serial().primaryKey(),
	buyerId: integer()
		.notNull()
		.references(() => buyer.id),
	listingId: integer()
		.notNull()
		.references(() => listing.id),
	dateCreated: timestamp({ withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const transaction = pgTable('transaction', {
	id: serial().primaryKey(),
	offerId: integer()
		.notNull()
		.references(() => offer.id),
	dateCreated: timestamp({ withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const rentTransaction = pgTable('rent_transaction', {
	id: integer()
		.primaryKey()
		.references(() => transaction.id)
});

export const saleTransaction = pgTable('sale_transaction', {
	id: integer()
		.primaryKey()
		.references(() => transaction.id)
});

export const leaseTransaction = pgTable('lease_transaction', {
	id: integer()
		.primaryKey()
		.references(() => transaction.id)
});

// TODO: Improve address
export const address = pgTable('address', {
	id: serial().primaryKey(),
	street: varchar().notNull().default(''),
	barangay: varchar().notNull(),
	city: varchar().notNull(),
	province: varchar().notNull()
});

export const UserRelation = relations(user, ({ one, many }) => ({
	address: one(address, { fields: [user.addressId], references: [address.id] }),
	agent: one(agent),
	buyer: one(buyer)
}));

export const AgentRelation = relations(agent, ({ one, many }) => ({
	user: one(user, { fields: [agent.id], references: [user.id] }),
	listing: many(listing)
}));

export const BuyerRelation = relations(buyer, ({ one, many }) => ({
	user: one(user, { fields: [buyer.id], references: [user.id] }),
	offers: many(offer)
}));

export const PropertyRelation = relations(property, ({ one, many }) => ({
	address: one(address, { fields: [property.addressId], references: [address.id] }),
	features: many(propertyFeature),
	tags: many(propertyTag),
	listing: one(listing)
}));

export const PropertyFeatureRelation = relations(propertyFeature, ({ one }) => ({
	property: one(property, { fields: [propertyFeature.propertyId], references: [property.id] })
}));

export const PropertyTagRelation = relations(propertyTag, ({ one }) => ({
	property: one(property, { fields: [propertyTag.propertyId], references: [property.id] })
}));

export const ListingRelation = relations(listing, ({ one, many }) => ({
	agent: one(agent, { fields: [listing.agentId], references: [agent.id] }),
	property: one(property, { fields: [listing.propertyId], references: [property.id] }),
	offers: many(offer)
}));

export const OfferRelation = relations(offer, ({ one }) => ({
	listing: one(listing, { fields: [offer.listingId], references: [listing.id] }),
	buyer: one(buyer, { fields: [offer.buyerId], references: [buyer.id] })
}));

export const TransactionRelation = relations(transaction, ({ one }) => ({
	offer: one(offer, { fields: [transaction.id], references: [offer.id] }),
	rentTransaction: one(rentTransaction),
	saleTransaction: one(saleTransaction),
	leaseTransaction: one(leaseTransaction)
}));

export const RentTransactionRelation = relations(rentTransaction, ({ one }) => ({
	transaction: one(transaction, { fields: [rentTransaction.id], references: [transaction.id] })
}));

export const SaleTransactionRelation = relations(saleTransaction, ({ one }) => ({
	transaction: one(transaction, { fields: [saleTransaction.id], references: [transaction.id] })
}));

export const LeaseTransactionRelation = relations(leaseTransaction, ({ one }) => ({
	transaction: one(transaction, { fields: [leaseTransaction.id], references: [transaction.id] })
}));

export const AddressRelation = relations(address, ({ many }) => ({
	users: many(user),
	properties: many(property)
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Address = typeof address.$inferSelect;
export type Property = typeof property.$inferSelect;

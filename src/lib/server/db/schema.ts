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
		.references(() => user.id)
});

export const broker = pgTable('broker', {
	id: integer()
		.primaryKey()
		.references(() => agent.id)
});

export const property = pgTable('property', {
	id: serial().primaryKey(),
	name: text().notNull(),
	description: text().notNull(),
	type: varchar({ enum: ['rent', 'sale', 'lease'] }).notNull(),
	status: varchar({ enum: ['up', 'sold'] }).notNull(),
	leaseUntil: date(),
	category: text({
		enum: [
			...propertyCategory.commercial,
			...propertyCategory.residential,
			...propertyCategory.land
		]
	}).notNull(),
	agentId: integer()
		.notNull()
		.references(() => agent.id),
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

// TODO: Improve address
export const address = pgTable('address', {
	id: serial().primaryKey(),
	street: varchar().notNull().default(''),
	barangay: varchar().notNull(),
	city: varchar().notNull(),
	province: varchar().notNull()
});

export const UserRelation = relations(user, ({ one, many }) => ({
	address: one(address, { fields: [user.addressId], references: [address.id] })
}));

export const PropertyRelation = relations(property, ({ one, many }) => ({
	agent: one(agent, { fields: [property.agentId], references: [agent.id] }),
	address: one(address, { fields: [property.addressId], references: [address.id] }),
	features: many(propertyFeature),
	tags: many(propertyTag)
}));

export const PropertyFeatureRelation = relations(propertyFeature, ({ one }) => ({
	property: one(property, { fields: [propertyFeature.propertyId], references: [property.id] })
}));

export const PropertyTagRelation = relations(propertyTag, ({ one }) => ({
	property: one(property, { fields: [propertyTag.propertyId], references: [property.id] })
}));

export const AddressRelation = relations(address, ({ many }) => ({
	users: many(user),
	properties: many(property)
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Address = typeof address.$inferSelect;
export type Property = typeof property.$inferSelect;

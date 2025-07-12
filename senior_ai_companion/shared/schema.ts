import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for family members
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'elderly' or 'caregiver'
  preferredAgent: text("preferred_agent"), // 'grace' or 'alex'
  voiceEnabled: boolean("voice_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Conversations table for storing chat history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  agentId: text("agent_id").notNull(), // 'grace' or 'alex'
  message: text("message").notNull(),
  response: text("response"),
  emotionalState: text("emotional_state"), // 'happy', 'sad', 'concerned', etc.
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // Additional context data
});

// Family connections table
export const familyConnections = pgTable("family_connections", {
  id: serial("id").primaryKey(),
  elderlyUserId: integer("elderly_user_id").references(() => users.id),
  caregiverUserId: integer("caregiver_user_id").references(() => users.id),
  relationshipType: text("relationship_type").notNull(), // 'child', 'spouse', 'sibling', etc.
  lastContactDate: timestamp("last_contact_date"),
  contactFrequency: text("contact_frequency").default('weekly'), // 'daily', 'weekly', 'monthly'
  createdAt: timestamp("created_at").defaultNow(),
});

// Memories table for storing family memories and stories
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id").references(() => familyConnections.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'story', 'photo', 'milestone', etc.
  participants: text("participants").array(), // Array of user IDs
  dateOfMemory: timestamp("date_of_memory"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reminders and notifications
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  reminderType: text("reminder_type").notNull(), // 'call', 'appointment', 'medication', 'care_facility', etc.
  scheduledTime: timestamp("scheduled_time").notNull(),
  completed: boolean("completed").default(false),
  priority: text("priority").default('medium'), // 'low', 'medium', 'high', 'urgent'
  careCoordination: jsonb("care_coordination"), // Care facility details, family notifications
  createdAt: timestamp("created_at").defaultNow(),
});

// Care coordination notifications
export const careNotifications = pgTable("care_notifications", {
  id: serial("id").primaryKey(),
  elderlyUserId: integer("elderly_user_id").references(() => users.id),
  notificationType: text("notification_type").notNull(), // 'appointment', 'medication', 'emergency', 'care_update'
  title: text("title").notNull(),
  description: text("description").notNull(),
  scheduledTime: timestamp("scheduled_time"),
  careProvider: text("care_provider"), // Name of care facility or provider
  familyInvited: boolean("family_invited").default(true),
  assistanceNeeded: boolean("assistance_needed").default(false),
  urgencyLevel: text("urgency_level").default('normal'), // 'low', 'normal', 'high', 'emergency'
  metadata: jsonb("metadata"), // Additional care details
  notifiedFamilyMembers: text("notified_family_members").array(), // Array of user IDs
  createdAt: timestamp("created_at").defaultNow(),
});

// Agent communications log
export const agentCommunications = pgTable("agent_communications", {
  id: serial("id").primaryKey(),
  fromAgent: text("from_agent").notNull(),
  toAgent: text("to_agent").notNull(),
  message: text("message").notNull(),
  context: jsonb("context"), // Additional context data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Sleep schedules with music and binaural beats
export const sleepSchedules = pgTable("sleep_schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bedtime: text("bedtime").notNull(), // HH:MM format
  duration: integer("duration").notNull(), // minutes
  musicType: text("music_type").notNull(), // 'classical', 'nature', 'instrumental', 'custom'
  binauralFrequency: integer("binaural_frequency").notNull(), // Hz (e.g., 40 for gamma, 10 for alpha)
  volume: integer("volume").default(50), // 0-100 percentage
  isActive: boolean("is_active").default(true),
  musicPreferences: jsonb("music_preferences"), // genres, artists, familiar songs
  sleepGoals: text("sleep_goals").array(), // 'deep_sleep', 'memory_consolidation', 'relaxation'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Picture frame system for family photo sharing
export const pictureFrames = pgTable("picture_frames", {
  id: serial("id").primaryKey(),
  elderlyUserId: integer("elderly_user_id").references(() => users.id).notNull(),
  deviceId: text("device_id").notNull().unique(), // Physical device identifier
  deviceName: text("device_name").notNull(),
  isActive: boolean("is_active").default(true),
  displayDuration: integer("display_duration").default(30), // seconds per photo
  brightness: integer("brightness").default(80), // 0-100 percentage
  transitionEffect: text("transition_effect").default('fade'), // 'fade', 'slide', 'dissolve'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Family photos for picture frame display
export const familyPhotos = pgTable("family_photos", {
  id: serial("id").primaryKey(),
  pictureFrameId: integer("picture_frame_id").references(() => pictureFrames.id).notNull(),
  senderUserId: integer("sender_user_id").references(() => users.id).notNull(),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  isApproved: boolean("is_approved").default(true),
  displayOrder: integer("display_order").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  sentAt: timestamp("sent_at").defaultNow(),
  viewedAt: timestamp("viewed_at"),
  metadata: jsonb("metadata"), // photo dimensions, file size, etc.
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  timestamp: true,
});

export const insertFamilyConnectionSchema = createInsertSchema(familyConnections).omit({
  id: true,
  createdAt: true,
});

export const insertMemorySchema = createInsertSchema(memories).omit({
  id: true,
  createdAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export const insertCareNotificationSchema = createInsertSchema(careNotifications).omit({
  id: true,
  createdAt: true,
});

export const insertAgentCommunicationSchema = createInsertSchema(agentCommunications).omit({
  id: true,
  timestamp: true,
});

export const insertSleepScheduleSchema = createInsertSchema(sleepSchedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPictureFrameSchema = createInsertSchema(pictureFrames).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyPhotoSchema = createInsertSchema(familyPhotos).omit({
  id: true,
  uploadedAt: true,
  sentAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type FamilyConnection = typeof familyConnections.$inferSelect;
export type InsertFamilyConnection = z.infer<typeof insertFamilyConnectionSchema>;
export type Memory = typeof memories.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type CareNotification = typeof careNotifications.$inferSelect;
export type InsertCareNotification = z.infer<typeof insertCareNotificationSchema>;
export type AgentCommunication = typeof agentCommunications.$inferSelect;
export type InsertAgentCommunication = z.infer<typeof insertAgentCommunicationSchema>;
export type SleepSchedule = typeof sleepSchedules.$inferSelect;
export type InsertSleepSchedule = z.infer<typeof insertSleepScheduleSchema>;
export type PictureFrame = typeof pictureFrames.$inferSelect;
export type InsertPictureFrame = z.infer<typeof insertPictureFrameSchema>;
export type FamilyPhoto = typeof familyPhotos.$inferSelect;
export type InsertFamilyPhoto = z.infer<typeof insertFamilyPhotoSchema>;

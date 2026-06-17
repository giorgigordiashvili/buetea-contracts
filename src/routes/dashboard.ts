import { z } from "zod";
import { defineRoute } from "../http.js";

const ownerRoles = ["OWNER"];
const zAnyObject = z.object({}).passthrough();

const zDateRangeQuery = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/** Owner analytics dashboard (income / sales / users). */
export const dashboardContracts = {
  getDashboard: defineRoute({
    method: "GET",
    path: "/admin/dashboard",
    auth: "roles",
    roles: ownerRoles,
    query: z.object({
      period: z.enum(["day", "week", "month", "year", "custom"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      date: z.string().optional(),
      month: z.string().optional(),
      year: z.string().optional(),
    }),
    response: zAnyObject,
  }),
  getIncomeBreakdown: defineRoute({
    method: "GET",
    path: "/admin/dashboard/income",
    auth: "roles",
    roles: ownerRoles,
    query: zDateRangeQuery,
    response: zAnyObject,
  }),
  getWebIncome: defineRoute({
    method: "GET",
    path: "/admin/dashboard/income/web",
    auth: "roles",
    roles: ownerRoles,
    query: zDateRangeQuery,
    response: zAnyObject,
  }),
  getStoreIncome: defineRoute({
    method: "GET",
    path: "/admin/dashboard/income/store",
    auth: "roles",
    roles: ownerRoles,
    query: zDateRangeQuery,
    response: zAnyObject,
  }),
  getSalesMetrics: defineRoute({
    method: "GET",
    path: "/admin/dashboard/sales",
    auth: "roles",
    roles: ownerRoles,
    query: z.object({
      period: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    response: zAnyObject,
  }),
  getSalesByDay: defineRoute({
    method: "GET",
    path: "/admin/dashboard/sales/day/:date",
    auth: "roles",
    roles: ownerRoles,
    params: z.object({ date: z.string() }),
    response: zAnyObject,
  }),
  getSalesByWeek: defineRoute({
    method: "GET",
    path: "/admin/dashboard/sales/week/:startDate",
    auth: "roles",
    roles: ownerRoles,
    params: z.object({ startDate: z.string() }),
    response: zAnyObject,
  }),
  getSalesByMonth: defineRoute({
    method: "GET",
    path: "/admin/dashboard/sales/month/:month/:year",
    auth: "roles",
    roles: ownerRoles,
    params: z.object({ month: z.string(), year: z.string() }),
    response: zAnyObject,
  }),
  getSalesByYear: defineRoute({
    method: "GET",
    path: "/admin/dashboard/sales/year/:year",
    auth: "roles",
    roles: ownerRoles,
    params: z.object({ year: z.string() }),
    response: zAnyObject,
  }),
  getSalesByRange: defineRoute({
    method: "GET",
    path: "/admin/dashboard/sales/range",
    auth: "roles",
    roles: ownerRoles,
    query: z.object({ startDate: z.string(), endDate: z.string() }),
    response: zAnyObject,
  }),
  getUserStatistics: defineRoute({
    method: "GET",
    path: "/admin/dashboard/users",
    auth: "roles",
    roles: ownerRoles,
    query: zDateRangeQuery,
    response: z
      .object({
        total: z.unknown(),
        new: z.unknown(),
        active: z.unknown(),
        byRole: z.unknown(),
      })
      .passthrough(),
  }),
  getUserGrowth: defineRoute({
    method: "GET",
    path: "/admin/dashboard/users/growth",
    auth: "roles",
    roles: ownerRoles,
    query: z.object({ startDate: z.string(), endDate: z.string() }),
    response: zAnyObject,
  }),
} as const;

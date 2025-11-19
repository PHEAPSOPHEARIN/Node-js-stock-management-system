import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
        displayName: "Super Administrator",
        description: "Full system access",
        level: 100,
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: "ADMIN",
        displayName: "Administrator",
        description: "Administrative access",
        level: 90,
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: "MANAGER",
        displayName: "Manager",
        description: "Manage inventory and orders",
        level: 50,
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: "STAFF",
        displayName: "Staff",
        description: "Basic operations",
        level: 30,
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: "VIEWER",
        displayName: "Viewer",
        description: "Read-only access",
        level: 10,
        isSystem: true,
      },
    }),
  ]);

  console.log("✅ Roles created");

  // Create permissions
  const permissions = [
    {
      name: "users.create",
      displayName: "Create Users",
      resource: "users",
      action: "create",
    },
    {
      name: "users.read",
      displayName: "View Users",
      resource: "users",
      action: "read",
    },
    {
      name: "users.update",
      displayName: "Update Users",
      resource: "users",
      action: "update",
    },
    {
      name: "users.delete",
      displayName: "Delete Users",
      resource: "users",
      action: "delete",
    },
    {
      name: "products.create",
      displayName: "Create Products",
      resource: "products",
      action: "create",
    },
    {
      name: "products.read",
      displayName: "View Products",
      resource: "products",
      action: "read",
    },
    {
      name: "products.update",
      displayName: "Update Products",
      resource: "products",
      action: "update",
    },
    {
      name: "products.delete",
      displayName: "Delete Products",
      resource: "products",
      action: "delete",
    },
    {
      name: "stock.read",
      displayName: "View Stock",
      resource: "stock",
      action: "read",
    },
    {
      name: "stock.adjust",
      displayName: "Adjust Stock",
      resource: "stock",
      action: "adjust",
    },
    {
      name: "stock.transfer",
      displayName: "Transfer Stock",
      resource: "stock",
      action: "transfer",
    },
    {
      name: "companies.create",
      displayName: "Create Companies",
      resource: "companies",
      action: "create",
    },
    {
      name: "companies.read",
      displayName: "View Companies",
      resource: "companies",
      action: "read",
    },
    {
      name: "companies.update",
      displayName: "Update Companies",
      resource: "companies",
      action: "update",
    },
    {
      name: "companies.delete",
      displayName: "Delete Companies",
      resource: "companies",
      action: "delete",
    },
    {
      name: "reports.view",
      displayName: "View Reports",
      resource: "reports",
      action: "view",
    },
    {
      name: "reports.export",
      displayName: "Export Reports",
      resource: "reports",
      action: "export",
    },
  ];

  await prisma.permission.createMany({ data: permissions });
  console.log("✅ Permissions created");

  // Assign all permissions to SUPER_ADMIN
  const allPermissions = await prisma.permission.findMany();
  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({
      roleId: roles[0].id,
      permissionId: p.id,
    })),
  });

  console.log("✅ Role permissions assigned");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      fullName: "Admin User",
      roleId: roles[0].id,
      phone: "+1234567890",
    },
  });

  console.log("✅ Admin user created");
  console.log("📧 Email: admin@example.com");
  console.log("🔑 Password: admin123");

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

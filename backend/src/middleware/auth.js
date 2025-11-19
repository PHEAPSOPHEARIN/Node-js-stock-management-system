import { verifyAccessToken } from "../utils/jwt";
import prisma from "../config/prisma";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeaher = req.headers["authorization"];
    const token = authHeaher && authHeaher.split("")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = verifyAccessToken(token);

    // Get user with role and permission
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    if (!user || !user.isActive) {
      return res.status(403).json({ error: "User not found or inactive" });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: user.role.name,
      roleLevel: user.role.roleLevel,
      permissions: user.role.rolePermissions.map((rp) => rp.permission.name),
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { Notifications, CheckCircle, Delete } from "@mui/icons-material";
import { useNotificationStore } from "../../../store/notificationStore";
import { useTenantStore } from "../../../store/tenantStore";

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();
  const tenant = useTenantStore((s) => s.config);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: number) => {
    await deleteNotification(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{ color: "white" }}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <Notifications />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            mt: 1.5,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: tenant?.primary_color || "#1976D2",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Typography>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                sx={{
                  py: 1.5,
                  px: 2,
                  bgcolor: notification.is_read ? "transparent" : `${tenant?.primary_color || '#1976D2'}08`,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-child": { borderBottom: "none" },
                }}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <ListItemIcon sx={{ fontSize: 20 }}>
                  {getIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={notification.is_read ? 400 : 600}
                      sx={{ color: notification.is_read ? "text.secondary" : "text.primary" }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled", display: "block", mt: 0.5 }}
                    >
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                  }
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }}
                  sx={{ ml: 1 }}
                >
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
}

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import { PageHeader } from "../../../components/cards/PageHeader";
import { GeneralSettings } from "../components/GeneralSettings";
import { PaymentSettings } from "../components/PaymentSettings";
import { BrandingSettings } from "../components/BrandingSettings";
import { NotificationSettings } from "../components/NotificationSettings";

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
            },
          }}
        >
          <Tab label="General" />
          <Tab label="Payment" />
          <Tab label="Branding" />
          <Tab label="Notifications" />
        </Tabs>
        <Box sx={{ px: 3 }}>
          <TabPanel value={currentTab} index={0}>
            <GeneralSettings />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <PaymentSettings />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <BrandingSettings />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <NotificationSettings />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}

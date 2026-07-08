import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { STATUS_LABELS, ORDER_STATUS_FLOW } from "../../../utilities/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { laundryApi } from "../api/laundryApi";
import { eventBus } from "../../../services/eventBus";

interface WorkflowTimelineProps {
  orderId: number;
  currentStatus: string;
}

export function WorkflowTimeline({ orderId, currentStatus }: WorkflowTimelineProps) {
  const queryClient = useQueryClient();
  const currentIdx = ORDER_STATUS_FLOW.indexOf(currentStatus as typeof ORDER_STATUS_FLOW[number]);

  const mutation = useMutation({
    mutationFn: (status: string) => laundryApi.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      eventBus.emit("order.status_changed", { orderId, status: currentStatus });
    },
  });

  const activeSteps = ORDER_STATUS_FLOW.slice(0, 8);
  const nextStatus = activeSteps[currentIdx + 1];

  return (
    <Box>
      <Stepper activeStep={currentIdx} alternativeLabel>
        {activeSteps.map((step) => (
          <Step key={step}>
            <StepLabel>{STATUS_LABELS[step]}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {nextStatus && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            size="small"
            onClick={() => mutation.mutate(nextStatus)}
            disabled={mutation.isPending}
          >
            Mark {STATUS_LABELS[nextStatus]}
          </Button>
        </Box>
      )}
    </Box>
  );
}

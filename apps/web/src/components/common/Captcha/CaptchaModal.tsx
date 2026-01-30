import { Box, DialogContent, Typography } from '@mui/material'
import ModalDialog from '@/components/common/ModalDialog'

interface CaptchaModalProps {
  open: boolean
  onWidgetContainerReady: (container: HTMLDivElement | null) => void
}

const CaptchaModal = ({ open, onWidgetContainerReady }: CaptchaModalProps) => {
  return (
    <ModalDialog
      open={open}
      hideChainIndicator
      dialogTitle="Security check"
      // Keep mounted so the widget container stays in DOM for Turnstile to render into
      keepMounted
    >
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
          <Typography variant="body1" color="text.secondary">
            Please complete the check below.
          </Typography>

          <Box ref={onWidgetContainerReady} />
        </Box>
      </DialogContent>
    </ModalDialog>
  )
}

export default CaptchaModal

import React from 'react'
import {
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
} from '@mui/material'

interface ReusableFormProps {
    title: string
    nameValue: string
    emailValue: string
    messageValue: string
    onFieldChange?: (name: string, value: string) => void
    onSubmit?: (e: React.FormEvent) => void
    showSubmitButton?: boolean
    submitButtonText?: string
    readOnly?: boolean
}

const ReusableForm: React.FC<ReusableFormProps> = ({
    title,
    nameValue,
    emailValue,
    messageValue,
    onFieldChange,
    onSubmit,
    showSubmitButton = true,
    submitButtonText = 'Submit',
    readOnly = false,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (onFieldChange && !readOnly) {
            onFieldChange(e.target.name, e.target.value)
        }
    }

    return (
        <Paper
            elevation={0}
            sx={{
                flex: 1,
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                {title}
            </Typography>
            <Stack component={onSubmit ? 'form' : 'div'} onSubmit={onSubmit} spacing={2} noValidate>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={nameValue}
                    onChange={readOnly ? undefined : handleChange}
                    required={!readOnly}
                    InputProps={readOnly ? { readOnly: true } : undefined}
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={emailValue}
                    onChange={readOnly ? undefined : handleChange}
                    required={!readOnly}
                    InputProps={readOnly ? { readOnly: true } : undefined}
                />
                <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={messageValue}
                    onChange={readOnly ? undefined : handleChange}
                    multiline
                    rows={4}
                    required={!readOnly}
                    InputProps={readOnly ? { readOnly: true } : undefined}
                />
                {showSubmitButton && (
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                            py: 1.5,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                            },
                        }}
                    >
                        {submitButtonText}
                    </Button>
                )}
            </Stack>
        </Paper>
    )
}

export default ReusableForm

import React, { useState } from 'react'
import {
    Container,
    Typography,
    Stack,
    Box,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ReusableForm from '../components/ReusableForm'
import DatagridTest from './DatagridTest'


const FlexCheck: React.FC = () => {
    // Contact form data (read-only)
    const contactFormData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a preset message that cannot be changed.',
    }

    // Feedback form data (editable)
    const [feedbackFormData, setFeedbackFormData] = useState({
        name: '',
        email: '',
        message: '',
    })

    const handleFeedbackChange = (name: string, value: string) => {
        setFeedbackFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Feedback form submitted:', feedbackFormData)
        // Handle feedback form submission here
    }

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            {/* Single Row Layout: Header -> Arrow -> Form1 -> Arrow -> Form2 */}
            <Stack direction="row" spacing={3} alignItems="flex-start" justifyContent="center">
                {/* Header Section */}
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        FlexCheck
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, mb: 1 }}
                    >
                        Streamline Your Workflow
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8 }}
                    >
                        Your ultimate solution for managing tasks efficiently.
                    </Typography>
                </Box>

                {/* Contact Form - Using ReusableForm */}
                <ReusableForm
                    title="Get in Touch"
                    nameValue={contactFormData.name}
                    emailValue={contactFormData.email}
                    messageValue={contactFormData.message}
                    showSubmitButton={false}
                    readOnly={true}
                />

                {/* Arrow Separator */}
                <Box sx={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                    <ArrowForwardIcon
                        sx={{
                            fontSize: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    />
                </Box>

                {/* Feedback Form - Using ReusableForm */}
                <ReusableForm
                    title="Share Your Feedback"
                    nameValue={feedbackFormData.name}
                    emailValue={feedbackFormData.email}
                    messageValue={feedbackFormData.message}
                    onFieldChange={handleFeedbackChange}
                    onSubmit={handleFeedbackSubmit}
                    submitButtonText="Submit Feedback"
                />
            </Stack>

            {/* New DataGrid Section Below */}
            <DatagridTest />
        </Container>
    )
}

export default FlexCheck


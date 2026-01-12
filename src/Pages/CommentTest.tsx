import { Box, Container, Typography } from '@mui/material';
import CommentEditor from '../components/Comments/CommentEditor';

const CommentTest = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Comment Component Verification
            </Typography>

            <Box sx={{ mb: 5 }}>
                <CommentEditor />
            </Box>

        </Container>
    );
};

export default CommentTest;

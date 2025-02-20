import axios from 'axios';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];

        try {
            const response = await axios.get(
                'https://authentik.prismic.fr/api/v3/core/users/me/',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            req.user = response.data;
            next();
        } catch (error) {
            if (error.response?.status === 401) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            throw error;
        }
    } catch (error) {
        return res.status(500).json({ error: error.response.data});
    }
};

export default authMiddleware;
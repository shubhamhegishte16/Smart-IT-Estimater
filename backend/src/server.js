import dotenv from 'dotenv';
import dns from 'dns';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

if (dns.getServers().includes('127.0.0.1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

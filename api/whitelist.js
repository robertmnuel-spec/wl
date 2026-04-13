import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Hanya menerima metode POST' });
    }

    const { char_name } = req.body;

    // --- KONFIGURASI PTERODACTYL ---
    const PTERO_URL = "https://aurevalorhosting.site"; // GANTI dengan URL Panel Anda
    const SERVER_ID = "cc3460d9"; // GANTI dengan Server ID (lihat di URL panel)
    const API_KEY = "ptlc_Xqlay2glmTZz9LSqSA2lAoF4JtKMZmgDMHMPBBVqwu9"; // GANTI dengan Client API Key Anda
    const TARGET_PATH = "scriptfiles/Whitelist/";

    if (!char_name || char_name.length < 3) {
        return res.status(400).json({ message: 'Nama karakter tidak valid!' });
    }

    // Membersihkan nama agar aman untuk sistem file
    const cleanName = char_name.replace(/[^A-Za-z0-9_]/g, '');
    const fileName = `${cleanName}.ini`;
    
    // Isi file .ini (bisa Anda sesuaikan)
    const fileContent = `[whitelist]\nCharacterName=${cleanName}\nStatus=Active\nRegisteredBy=VercelWeb`;

    try {
        // Menggunakan API Pterodactyl untuk menulis file secara remote
        await axios.post(
            `${PTERO_URL}/api/client/servers/${SERVER_ID}/files/write?file=${encodeURIComponent(TARGET_PATH + fileName)}`,
            fileContent,
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'text/plain',
                    'Accept': 'application/json',
                }
            }
        );

        return res.status(200).json({ message: `Sukses! ${fileName} telah ditambahkan.` });
    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(500).json({ message: 'Gagal mengirim data ke Pterodactyl.' });
    }
}


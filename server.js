import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/addclient', async (req, res) => {

    const {level, name, wpp} = req.body;

    try {

        const client = await prisma.client.create({
    
            data: {
    
                level,
                name,
                wpp
    
            }
    
        });
        res.json("cliente adicionado com sucesso " +client);

    } catch (error) {
        console.log("erro ao adicionar cliente. " + error);
    }


});

app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`);

});

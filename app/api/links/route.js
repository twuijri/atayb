import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'links.json');

// Helper to read data
const getData = () => {
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContent);
};

// Helper to write data
const saveData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

export async function GET() {
    const data = getData();
    return NextResponse.json(data);
}

export async function POST(request) {
    try {
        const body = await request.json();
        // Simple validation could go here

        // If body is an array, replace all (reordering).
        // If object, add/update. 
        // For simplicity, let's assume the Dashboard sends the Full List for reordering/updates.

        if (Array.isArray(body)) {
            saveData(body);
            return NextResponse.json({ success: true, message: "Links updated" });
        }

        return NextResponse.json({ success: false, message: "Invalid data format" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error saving data" }, { status: 500 });
    }
}

import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'data', 'logs');
const logsFile = path.join(logsDir, 'system.log');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

export function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        data
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
        fs.appendFileSync(logsFile, logLine);
    } catch (error) {
        console.error('Failed to write log:', error);
    }
}

export function getLogs(limit = 100, level = null) {
    try {
        if (!fs.existsSync(logsFile)) {
            return [];
        }

        const content = fs.readFileSync(logsFile, 'utf8');
        const lines = content.trim().split('\n').filter(line => line);
        
        let logs = lines.map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        }).filter(log => log !== null);

        // Filter by level if specified
        if (level) {
            logs = logs.filter(log => log.level === level);
        }

        // Return last N logs (most recent first)
        return logs.slice(-limit).reverse();
    } catch (error) {
        console.error('Failed to read logs:', error);
        return [];
    }
}

export function clearLogs() {
    try {
        fs.writeFileSync(logsFile, '');
        return true;
    } catch (error) {
        console.error('Failed to clear logs:', error);
        return false;
    }
}

import * as fs from 'fs';
import * as path from 'path';

// Define types for input data
interface Track {
    endTime: string;
    artistName: string;
    trackName: string;
    msPlayed: number;
}

interface Podcast {
    endTime: string;
    podcastName: string;
    episodeName: string;
    msPlayed: number;
}

// Define type for aggregated data
interface PeriodData {
    period: string;
    totalMinutes: number;
}

// Function to convert milliseconds to minutes
function msToMinutes(ms: number): number {
    return ms / 60000;
}

// Function to extract the relevant period based on the type
function extractPeriod(endTime: string, periodType: 'days' | 'months' | 'years'): string {
    const date = new Date(endTime);
    if (periodType === 'days') {
        return date.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"
    } else if (periodType === 'months') {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format month as "YYYY-MM"
    } else if (periodType === 'years') {
        return `${date.getFullYear()}`; // Format year as "YYYY"
    }
    throw new Error('Invalid period type');
}

// Function to process data for a given period type or date range
function processListeningData(
    tracksArray: Track[],
    podcastArray: Podcast[],
    periodType: 'days' | 'months' | 'years' | 'custom',
    startDate?: string,
    endDate?: string
): PeriodData[] {
    const now = new Date();
    let filterStartDate: Date;
    let filterEndDate: Date;

    if (periodType === 'custom') {
        if (!startDate || !endDate) {
            throw new Error('For custom period, both startDate and endDate must be provided');
        }
        filterStartDate = new Date(startDate);
        filterEndDate = new Date(endDate);
    } else {
        if (periodType === 'days') {
            filterStartDate = new Date(now.setMonth(now.getMonth() - 1)); // Last 1 month
            filterEndDate = new Date(); // Up to current date
        } else if (periodType === 'months') {
            filterStartDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Last 1 year
            filterEndDate = new Date(); // Up to current date
        } else if (periodType === 'years') {
            filterStartDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
            filterEndDate = new Date(); // Up to current date
        } else {
            throw new Error('Invalid period type');
        }
    }

    // Combine tracks and podcasts into a single array
    const combinedArray = [
        ...tracksArray.map(track => ({
            endTime: track.endTime,
            name: track.trackName,
            artistName: track.artistName,
            msPlayed: track.msPlayed,
            type: 'track'
        })),
        ...podcastArray.map(podcast => ({
            endTime: podcast.endTime,
            name: podcast.episodeName,
            artistName: podcast.podcastName,
            msPlayed: podcast.msPlayed,
            type: 'podcast'
        }))
    ];

    // Aggregate listening data
    const periodDataMap: { [key: string]: { totalMinutes: number } } = {};
    combinedArray.forEach(item => {
        const endTime = new Date(item.endTime);
        if (endTime < filterStartDate || endTime > filterEndDate) return; // Filter out data outside the range

        const period = periodType === 'custom'
            ? `${item.endTime}` // Custom periods don't need special formatting
            : extractPeriod(item.endTime, periodType);

        const minutesPlayed = msToMinutes(item.msPlayed);

        if (!periodDataMap[period]) {
            periodDataMap[period] = { totalMinutes: 0 };
        }
        periodDataMap[period].totalMinutes += minutesPlayed;
    });

    // Convert periodDataMap to an array
    const periodData: PeriodData[] = Object.entries(periodDataMap)
        .map(([period, data]) => ({
            period,
            totalMinutes: data.totalMinutes
        }))
        .sort((a, b) => b.totalMinutes - a.totalMinutes);

    return periodData;
}

// Function to write data to JSON files in the 'json' folder
function writeResultsToFile(fileName: string, data: PeriodData[]): void {
    const jsonFolderPath = path.join(__dirname, 'json');
    
    // Create the folder if it doesn't exist
    if (!fs.existsSync(jsonFolderPath)) {
        fs.mkdirSync(jsonFolderPath);
    }
    
    const filePath = path.join(jsonFolderPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Example usage
const tracksArray: Track[] = [
    { endTime: "2024-01-09 08:51", artistName: "Zerb", trackName: "Mwaki", msPlayed: 208135 },
    { endTime: "2024-01-15 09:54", artistName: "Spada", trackName: "Be Strong", msPlayed: 192605 },
    { endTime: "2024-02-10 10:58", artistName: "Elderbrook", trackName: "Numb", msPlayed: 230040 },
    { endTime: "2023-12-22 09:30", artistName: "Zerb", trackName: "Mwaki", msPlayed: 150000 }
];

const podcastArray: Podcast[] = [
    { endTime: "2024-01-10 17:31", podcastName: "VT Podcast “Ideas That Matter”", episodeName: "Foundations", msPlayed: 1659173 },
    { endTime: "2024-01-12 18:15", podcastName: "VT Podcast “Ideas That Matter”", episodeName: "Future Insights", msPlayed: 1200000 }
];

// Process data for different periods and write to files
const resultDays = processListeningData(tracksArray, podcastArray, 'days');
writeResultsToFile('listening_data_days.json', resultDays);

const resultMonths = processListeningData(tracksArray, podcastArray, 'months');
writeResultsToFile('listening_data_months.json', resultMonths);

const resultYears = processListeningData(tracksArray, podcastArray, 'years');
writeResultsToFile('listening_data_years.json', resultYears);

// Process data for a custom period and write to file
const startDate = "2024-01-01";
const endDate = "2024-01-31";
const resultCustomPeriod = processListeningData(tracksArray, podcastArray, 'custom', startDate, endDate);
writeResultsToFile('listening_data_custom.json', resultCustomPeriod);

// console.log('Data has been written to files in the "json" folder.');

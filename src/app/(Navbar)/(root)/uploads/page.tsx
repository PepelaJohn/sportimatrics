'use client'
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { ERROR, SUCCESS } from '@/constants';

type Track = {
endTime: string,
    artistName: string,
    trackName: string,
    msPlayed: number
  }

const Home = () => {
    const dispatch = useDispatch()
    const [jsonArray, setJsonArray] = useState<Track[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file)
        if (!file) {
            alert()
            return
        };

        const reader = new FileReader();
        // reader.abort()
        reader.onload = (e) => {
            try {
                console.log('geting')
                const result = e.target?.result as string;
                const parsedArray = JSON.parse(result);
                console.log('getting 2');
                
                setJsonArray(parsedArray);
                console.log(parsedArray);
                
                dispatch({type:SUCCESS, payload:"Succesfully uploaded"})// Verify the array in the console
            } catch (error:any) {
                // console.error('Error parsing JSON', error);
                dispatch({type:ERROR, payload:error.message || "Error parsing JSON"})
            }
        };
        reader.readAsText(file);
    };

    return (
        <section className="h-full w-full text-white-1 flex flex-col items-center justify-center ">
            

            <div className="flex bg-gray-900 min-h-[150px]   min-w-[180px] rounded-lg">

                <input hidden id='file' type="file" accept=".json" onChange={handleFileUpload} className="mt-4" />
                <label className=' h-full w-full px-2 cursor-pointer py-3 flex items-center justify-center' htmlFor="file">
                    <div className='flex text-gray-1  justify-center items-center flex-col gap-5'>
                    <Upload className='text-xs w-6'/>
                    <p className='text-[10px]'>JSON, ZIP, RAR</p>
                    </div>
                </label>
            </div>
        </section>
    );
};

export default Home;

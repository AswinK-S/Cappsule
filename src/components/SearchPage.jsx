import './SearchPage.css'
import { axiosApi } from '../services/api'
import { useEffect, useState } from 'react'
import SaltCard from './SaltCard'

const SearchPage = () => {
    const [searchTerm, setSeachTerm] = useState('')
    const [saltSuggetion, setSaltSuggetion] = useState([])

    const fetchData = async (searchTerm, pharmacyIds) => {
        try {
            const result = await axiosApi.get(`api/v1/new_search?q=${searchTerm}&pharmacyIds=${pharmacyIds}`)
            console.log('result--->', result);
            if (result) {
                setSaltSuggetion(result?.data?.data?.saltSuggestions)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSearch = async () => {
        if (searchTerm.trim() !== '') {
            const pharmacyIds = '1,2,3';
            fetchData(searchTerm.trim(), pharmacyIds);
            updateSearchIcon();
        }
    }

    const updateSearchIcon = () => {
        const searchInput = document.querySelector('.search-input');
        searchInput.classList.toggle('search-icon');
        searchInput.classList.toggle('reverse-icon');
    };

    useEffect(() => {
        const searchInput = document.querySelector('.search-input')
         document.querySelector('.search-icon')

        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                handleSearch();
                updateSearchIcon()
            }
        }

        searchInput.addEventListener('keydown', handleKeyDown);

        return () => {
            searchInput?.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchTerm])


    const handleChange = (e) => {
        setSeachTerm(e.target.value)
    }

    return (
        <>
            <div >
                {/* search section  */}
                <div className='flex  p-10 '>
                    <div className='flex flex-col items-center w-full gap-10'>
                        <h1>Cappsule web development test</h1>

                        <div className='w-full flex justify-center '>
                            <div className='search-container  flex justify-center'>
                                {searchTerm ? (
                                    <>
                                        <input className='search-input reverse-icon rounded-full '
                                            type="text" name="search"
                                            placeholder="Type your medicine name here"
                                            onChange={handleChange}
                                        />
                                        <button className='search-text' onClick={handleSearch}>Search</button>
                                    </>
                                ) : (
                                    <>
                                        <input className='search-input search-icon rounded-full' 
                                        type="text" name="search"
                                        placeholder="Type your medicine name here"
                                        onChange={handleChange}
                                        />
                                        
                                        <button className='search-text' onClick={handleSearch}>Search</button>
                                    </>
                                )}

                            </div>
                        </div>

                    </div>

                </div>

            </div>
            <div className='w-full flex justify-center'>
                <hr className='hr-line bg-[#CDCDCD] mb-10' />
            </div>
            {/* show medicine  */}
            <div className=' medicine-container '>
                {
                    saltSuggetion?.length ?
                        (
                            <div className='flex flex-col gap-10 items-center justify-center'>
                                <SaltCard saltSuggetion={saltSuggetion} />
                            </div>

                        ) : (
                            <div className='flex justify-center  items-center h-full'>
                                <p className='text-slate-400 font-medium'> &quot; Find medicines with amazing discount &quot;</p>
                            </div>
                        )
                }

            </div >

        </>
    )
}

export default SearchPage
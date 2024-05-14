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
            console.log('result--->',result);
            if (result) {
                setSaltSuggetion(result?.data?.data?.saltSuggestions)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const searchInput = document?.querySelector('.search-input')
        const searchIcon = document?.querySelector('.search-icon')

        const handleKeyDown = async (event) => {
            if (event.key === 'Enter' && searchTerm.trim() !== '') {
                const pharmacyIds = '1,2,3';
                fetchData(searchTerm.trim(), pharmacyIds);

                searchIcon.classList.remove('search-icon');
                searchIcon.classList.add('reverse-icon');
            }
        }

        const handleIconClick = () => {
            if (searchIcon.classList.contains('reverse-icon')) {
                searchInput.value = ''
                searchIcon.classList.remove('reverse-icon')
                searchIcon.classList.add('search-icon')
            }
        }

        searchInput.addEventListener('keydown', handleKeyDown);
        searchIcon.addEventListener('click', handleIconClick);

        return () => {
            searchInput.removeEventListener('keydown', handleKeyDown);
            searchIcon.removeEventListener('click', handleIconClick);

        };


    }, [searchTerm])

    console.log('salt suggetions-->',saltSuggetion);

    const handleChange = (e) => {
        console.log(e.target.value);
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
                            <div className='search-container    flex justify-center'>
                                <input className='search-input search-icon rounded-full '
                                    type="text" name="search"
                                    placeholder="Type your medicine name here"
                                    onChange={handleChange}
                                />
                                <button className='search-text'>Search</button>
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
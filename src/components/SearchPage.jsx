import './SearchPage.css'

const SearchPage = () => {

    const handleChange = (e)=>{
        console.log(e.target.value);
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
                                
                                <input className='search-input  rounded-full ' 
                                type="text" name="search" id=""
                                placeholder="Type your medicine name here"
                                onChange={handleChange}
                                />
                                <p className='search-text'>Search</p>
                            </div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <hr className='hr-line bg-[#CDCDCD] ' />
                        </div>
                    </div>

                </div>


            </div>
            {/* show medicine  */}
            <div className=' medicine-container '>
                <div className='flex justify-center  items-center h-full'>

                    <p className='text-slate-400 font-medium'> &quot; Find medicines with amazing discount &quot;</p>
                </div>
            </div>

        </>
    )
}

export default SearchPage
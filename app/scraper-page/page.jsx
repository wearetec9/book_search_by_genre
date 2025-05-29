'use client'
import React, { useState } from 'react'

const Page = () => {
  const [showData, setShowData] = useState([])
  const [value, setValue] = useState('')
  async function getData() {
    const retriveData = await fetch(`/api/scrape?query=${encodeURIComponent(value)}`)
    const data = await retriveData.json()
    console.log(data)

    if (Array.isArray(data)) {
      setShowData(data)
    } else {
      setShowData([]) // or handle error
      console.error('Expected array, got:', data)
    }

  }

  return (
    <div>
      <h1> Book Name and Image according to genre </h1>
      <input
        onChange={function (e) { setValue(e.target.value) }}
        value={value}
        type="text" placeholder='Enter genre' />
      <button onClick={getData}>Click me</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        {showData.map(function (book, index) {
          return (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <img src={book.image} alt={book.title} width={100} />
              <h3>{book.title}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Page

import React from 'react'
import Step from "./Step"
import { useSelector } from 'react-redux'

const Steps = () => {
  const page=useSelector((e)=>e.page.value)
  return (
    <div className='Steps'>
      <Step step={1} title={"PERSONAL INFO"} active={page==0}/>
      <Step step={2} title={"LOCATION"} active={page==1}/>
      <Step step={3} title={"ROLE"} active={page==2}/>
      <Step step={4} title={"FEATURES"} active={page==3}/>
      <Step step={5} title={"MENU"} active={page==4}/>
      <Step step={6} title={"SUMMARY"} active={page>=5}/>
      
    </div>
  )
}

export default Steps
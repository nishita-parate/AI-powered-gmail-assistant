
import {Box , Container , Typography , TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress} from '@mui/material'
import './App.css'
import { useState } from 'react'
import axios from 'axios';

function App() {
 const[emailContent, setEmailcontent]= useState('');
 const[tone, setTone]= useState('');
 const[generatedReply, setGeneratedReply]= useState('');
const[loading, setLoading]= useState(false);
    
const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await axios.post("http://localhost:8080/api/email/generate",{
      emailContent,
      tone
    });
    setGeneratedReply(typeof response.data ==='string' ?
      response.data : JSON.stringify(response.data)
    );
  } catch (error) {
    
  } finally{
    setLoading(false);
  }
    
   };

  return (
    <>
    <Container maxWidth ="md"  sx= {{py: 4}}>

      <Typography variant ='h3' component="h1" gutterBottom >
        Email Reply Generator
      </Typography>
         <Box sx= {{mx:3}}>
          <TextField
          
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label ="Criginal Email Content"
          value={ emailContent || ''}
          onChange={(e)=> setEmailcontent(e.target.value)}
          sx= {{mb :2}}

          />
          <FormControl fullWidth sx= {{mb :2}}>
                    <InputLabel >Tone (Optional)</InputLabel>
                 <Select
                      value={tone || ''}
                      label="Tone (Optional)"
                      onChange={(e) => setTone(e.target.value)}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="Professional">Professional</MenuItem>
                      <MenuItem value="Casual">Casual</MenuItem>
                      <MenuItem value="Friendly">Friendly</MenuItem>
                 </Select>
             </FormControl>
          <Button variant="contained" 
          sx= {{mb :2}}
          onClick = {handleSubmit}
          disabled ={!emailContent || loading}>
                  {loading ? <CircularProgress size= {24} /> : "Generate Reply" }
                 
               </Button>
               
         </Box>
         <Box sx= {{mx:3}}>
          <TextField
          
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          
          value={ generatedReply || ''}
          inputprops={{readOnly : true}} 
         
          sx= {{mb :2}}
          />
          </Box>
          <Button
          variant='outlined'
          onClick={()=> navigator.clipboard.writeText(generatedReply)}
          sx={{ml: 3}}>
                Copy to Clipboard
          </Button>
     </Container>

      </>
  )
}

export default App

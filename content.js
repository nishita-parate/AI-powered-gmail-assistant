console.log("Email Writer");

function getEmailContent(){
    const selectors=[
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'

    ];
    for( const selector of selectors){
    const content= document.querySelector(selector);
    if(content){
        return content.innerText.trim();
    }
    return '';
}

}
function findComposeToolBar(){
const selectors=[ '.btC','.aDh', '[role="toolbar"]', '.gU.Up'];
for( const selector of selectors){
    const toolbar= document.querySelector(selector);
    if(toolbar){
        return toolbar;
    }
    return null;
}


}

function createAIButton(){

    /*const button= document.createElement('div');
    button.className='T-I.J-J5-Ji.aoO.v7.T-I-atl.L3';
    button.style.marginRight='8px';
    button.innerHTML= 'AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button; */

    
    const button = document.createElement('button');
    button.className = 'ai-reply-button';  // your own class
    button.innerHTML = '✨ AI Reply';
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    button.type = 'button';

    // Explicit styling so it always looks like a button
    button.style.cssText = `
        background-color: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        margin-right: 8px;
        height: 32px;
        vertical-align: middle;
    `;

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#1557b0';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#1a73e8';
    });

    return button;
}

function injectButton(){
    const existingButton= document.querySelector('.ai-reply-button');
    if(existingButton){
        existingButton.remove();
    }
    const toolbar= findComposeToolBar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found");
const button= createAIButton();
button.classList.add('.ai-reply-button');
 button.addEventListener('click',async () => {
    try {
        button.innerHTML='Generating...';
        button.disabled= true;
        const emailContent= getEmailContent();


        const response= await fetch('http://localhost:8080/api/email/generate',{
           method:'POST',
           headers :{
            'Content-Type' : 'application/json',
           },
           body: JSON.stringify({
            emailContent: emailContent,
            tone: "professional"
           })

        });

        if(!response.ok){
             throw new Error("API Request Failed");
             
        }
                const generatedReply= await response.text();
            const composeBox= document.querySelector(
            
                '[role= "textbox"][g_editable="true"]'
            );
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);
                
            }
    } catch (error) {
        
    } finally{
        button.innerHTML= '✨AI Reply';
        button.disabled=false;
    }
 })


toolbar.insertBefore(button, toolbar.firstChild);
}

const observer= new MutationObserver((mutations) =>{
   for(const mutation of mutations){
    const addedNodes = Array.from(mutation.addedNodes);
     const hasComposedElements = addedNodes.some( node=> 
        node.nodeType=== node.ELEMENT_NODE &&
    (node.matches('.aDh,.btC,[role="dialog"]')
      ||node.querySelector('.aDh,.btC,[role="dialog"]'))
    );
    
    if(hasComposedElements){
        console.log("Composed window detected.");
        setTimeout(injectButton,500);
    }

   }
}
);

observer.observe(document.body,{
    childList: true,
    subtree: true

});
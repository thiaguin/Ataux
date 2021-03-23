import React from 'react';

const MainPage = () => {
    const parentInStyle = {
        margin: '5% 10% 5%',
        width: '80%',
        justifyContent: 'center',
        border: '3px solid lightgrey',
        borderRadius: '0.2em',
    };

    const childInStyle = {
        width: '80%',
        margin: '6% 10% 5% 10%',
    };

    return (
        <div style={parentInStyle}>
            <div style={childInStyle}>
                <h1 style={{ marginBottom: '30px' }}>Ataux</h1>
                <>
                    Uma ferramenta para auxiliar o acompanhamento de submissões de questões. Que utiliza problemas do
                    <a href="https://codeforces.com/"> Codeforces.</a>
                    <br />
                    <br />
                    Para qualquer dúvida ou sugestão entre em contato conosco:
                    <br />
                    <ul>
                        <li>timeataux@gmail.com</li>
                    </ul>
                    <br />
                    Resolva problemas para aprender novas técnicas de programação!
                </>
            </div>
        </div>
    );
};
export default MainPage;

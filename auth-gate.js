/* ---------- Novari Gestão — portão de login (Firebase Auth) ---------- */
/* Envolve o conteúdo da página: só renderiza os filhos quando há usuário autenticado. */
function AuthGate({children}) {
  const [authState, setAuthState] = React.useState({loading:true, user:null});
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [erro, setErro] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);

  React.useEffect(() => {
    if (!window.firebase || !firebase.auth) { setAuthState({loading:false, user:null}); return; }
    const unsub = firebase.auth().onAuthStateChanged(u => setAuthState({loading:false, user:u}));
    return unsub;
  }, []);

  function entrar(e) {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) { setErro('Informe e-mail e senha.'); return; }
    setEnviando(true);
    firebase.auth().signInWithEmailAndPassword(email.trim(), senha)
      .catch(err => {
        const msgs = {
          'auth/invalid-email': 'E-mail inválido.',
          'auth/user-not-found': 'E-mail ou senha incorretos.',
          'auth/wrong-password': 'E-mail ou senha incorretos.',
          'auth/invalid-credential': 'E-mail ou senha incorretos.',
          'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
          'auth/user-disabled': 'Esta conta está desativada.',
        };
        setErro(msgs[err.code] || 'Não foi possível entrar. Tente novamente.');
      })
      .finally(() => setEnviando(false));
  }

  if (authState.loading) {
    return (
      <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#F3F4F6', zIndex:9999}}>
        <div style={{width:34, height:34, border:'3px solid #E5E7EB', borderTopColor:'#151F38', borderRadius:'50%', animation:'ag-spin 1s linear infinite'}}></div>
        <style>{`@keyframes ag-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!authState.user) {
    return (
      <div style={{position:'fixed', inset:0, width:'100%', height:'100%', boxSizing:'border-box', background:'#F3F4F6', fontFamily:"system-ui,-apple-system,'Segoe UI',Roboto,sans-serif", display:'flex', alignItems:'center', justifyContent:'center', padding:24, zIndex:9999, overflow:'auto'}}>
        <form onSubmit={entrar} style={{width:'100%', maxWidth:380, background:'#FFFFFF', border:'1px solid #E5E7EB', borderTop:'3px solid #CE1B21', borderRadius:16, boxShadow:'0 4px 20px rgba(16,24,40,.08)', padding:'36px 32px 32px', boxSizing:'border-box', display:'flex', flexDirection:'column', gap:16}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10, marginBottom:4}}>
            <img src="novari-icon.png" alt="Novari Print" style={{width:52, height:52, objectFit:'contain'}} onError={e => { e.target.style.display = 'none'; }} />
            <div style={{textAlign:'center'}}>
              <h1 style={{margin:0, fontSize:17, fontWeight:700, color:'#151F38'}}>Novari Gestão</h1>
              <p style={{margin:'2px 0 0', fontSize:13, color:'#6B7280'}}>Entre com sua conta para continuar</p>
            </div>
          </div>
          <div>
            <label style={{display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6}} htmlFor="ag-email">E-mail</label>
            <input id="ag-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)}
              style={{boxSizing:'border-box', width:'100%', padding:'11px 14px', border:'1px solid #E5E7EB', borderRadius:10, fontSize:14, color:'#151F38'}} placeholder="seuemail@novariprint.com.br" />
          </div>
          <div>
            <label style={{display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6}} htmlFor="ag-senha">Senha</label>
            <input id="ag-senha" type="password" autoComplete="current-password" value={senha} onChange={e => setSenha(e.target.value)}
              style={{boxSizing:'border-box', width:'100%', padding:'11px 14px', border:'1px solid #E5E7EB', borderRadius:10, fontSize:14, color:'#151F38'}} placeholder="••••••••" />
          </div>
          {erro && <p style={{margin:0, fontSize:13, color:'#B42318', fontWeight:600}}>{erro}</p>}
          <button type="submit" disabled={enviando}
            style={{boxSizing:'border-box', width:'100%', padding:'12px 14px', border:'none', borderRadius:10, background:'#151F38', color:'#FFFFFF', fontSize:14.5, fontWeight:700, cursor: enviando ? 'default' : 'pointer', opacity: enviando ? .7 : 1}}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
          <p style={{margin:0, textAlign:'center', fontSize:12, color:'#9CA3AF'}}>Acesso restrito à equipe Novari Print.</p>
        </form>
      </div>
    );
  }

  return children;
}

const { chromium } = require('playwright');

async function githubLogin() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 2000 // 2 segundos entre cada ação
    });
    
    const page = await browser.newPage();
    
    // Configurar timeout maior para todas as ações
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    
    try {
        console.log('🚀 INICIANDO AUTOMAÇÃO - NAVEGADOR FICARÁ ABERTO POR 30+ SEGUNDOS');
        
        await page.goto('https://github.com/login', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        console.log('✅ Página carregada');
        
        await page.waitForSelector('input[name="login"]', { timeout: 20000 });
        
        // SUAS CREDENCIAIS AQUI
        const username = 'SEU_USUARIO_GITHUB';
        const password = 'SUA_SENHA_GITHUB';
        
        console.log('⌛ Preenchendo usuário (aguarde 2 segundos)...');
        await page.fill('input[name="login"]', username);
        await page.waitForTimeout(2000);
        
        console.log('⌛ Preenchendo senha (aguarde 2 segundos)...');
        await page.fill('input[name="password"]', password);
        await page.waitForTimeout(2000);
        
        console.log('⌛ Clicando no login (aguarde 2 segundos)...');
        await page.click('input[type="submit"]');
        
        // AGUARDA LONGO TEMPO PARA LOGIN
        console.log('⏳ AGUARDANDO LOGIN - ISSO PODE LEVAR ATÉ 25 SEGUNDOS...');
        
        try {
            await page.waitForNavigation({ 
                waitUntil: 'networkidle',
                timeout: 25000 
            });
        } catch (e) {
            console.log('ℹ️  Continuando sem detectar navegação...');
        }
        
        // ESPERA GARANTIDA de 10 segundos após possível login
        console.log('⏳ ESPERANDO 10 SEGUNDOS PARA CONFIRMAÇÃO VISUAL...');
        await page.waitForTimeout(10000);
        
        const currentUrl = page.url();
        console.log('🌐 URL final: ' + currentUrl);
        
        if (currentUrl.includes('https://github.com/') && !currentUrl.includes('login')) {
            console.log('🎉 ✅ LOGIN BEM-SUCEDIDO!');
            await page.screenshot({ path: 'SUCESSO.png' });
        } else {
            console.log('❌ Login pode ter falhado');
            await page.screenshot({ path: 'FALHA.png' });
        }
        
        // ⭐⭐ TEMPO EXTRA PARA VER O RESULTADO ⭐⭐
        console.log('👀 NAVEGADOR FICARÁ ABERTO POR MAIS 15 SEGUNDOS...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('💥 Erro:', error);
        await page.screenshot({ path: 'ERRO.png' });
        console.log('⏳ Aguardando 10 segundos...');
        await page.waitForTimeout(10000);
    } finally {
        await browser.close();
        console.log('✅ Script finalizado');
    }
}

githubLogin();
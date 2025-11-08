# 📱 Guia de Build - Aplicativos iOS e Android

Este guia fornece instruções passo a passo para construir e distribuir os aplicativos iOS e Android do Street Vendor Connect.

## 🚀 Pré-requisitos

### Para iOS
- Mac com macOS 12+
- Xcode 14+
- Apple Developer Account (para distribuição)
- CocoaPods

### Para Android
- Android Studio 2022+
- Android SDK 33+
- Java Development Kit (JDK) 11+
- Google Play Developer Account (para distribuição)

### Geral
- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g eas-cli`

## 📦 Instalação Local

### 1. Instalar Dependências

```bash
cd mobile
npm install
# ou
yarn install
```

### 2. Instalar Expo CLI

```bash
npm install -g eas-cli
npm install -g expo-cli
```

### 3. Configurar Projeto Expo

```bash
eas init
# Selecione a opção de criar novo projeto ou use um existente
```

## 🏃 Executar em Desenvolvimento

### iOS (apenas em Mac)
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## 🔨 Build para Produção

### Build Android

#### Opção 1: Build com EAS (Recomendado)
```bash
npm run build:android
```

#### Opção 2: Build Local
```bash
# Gerar APK
eas build --platform android --local

# Ou usar Gradle diretamente
cd android
./gradlew assembleRelease
```

### Build iOS

#### Opção 1: Build com EAS (Recomendado)
```bash
npm run build:ios
```

#### Opção 2: Build Local (apenas em Mac)
```bash
eas build --platform ios --local
```

## 📤 Distribuição

### Google Play Store (Android)

#### 1. Preparar Assinatura
```bash
# Gerar chave de assinatura
keytool -genkey -v -keystore street-vendor.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias street-vendor-key
```

#### 2. Configurar EAS
```bash
eas build --platform android --auto-submit
```

#### 3. Submeter Manualmente
```bash
npm run submit:android
```

### Apple App Store (iOS)

#### 1. Configurar Certificados
```bash
eas credentials
# Selecione iOS e configure os certificados
```

#### 2. Build e Submit
```bash
npm run submit:ios
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `mobile`:

```env
EXPO_PUBLIC_API_URL=https://seu-backend.com
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=production
```

## 📱 Recursos Implementados

### Geolocalização
- ✅ Permissões automáticas
- ✅ GPS em tempo real
- ✅ Fallback para rede
- ✅ Monitoramento contínuo

### Câmera
- ✅ Captura de fotos
- ✅ Acesso à galeria
- ✅ Compressão de imagens
- ✅ Upload para servidor

### Mapa
- ✅ Mapa interativo (Google Maps/Apple Maps)
- ✅ Marcadores de vendedores
- ✅ Localização do usuário
- ✅ Cálculo de distância

### Notificações
- ✅ Push notifications
- ✅ Notificações locais
- ✅ Badge no app

### Armazenamento
- ✅ AsyncStorage para dados locais
- ✅ Cache de imagens
- ✅ Sincronização offline

## 🐛 Troubleshooting

### Erro: "Permissão de localização negada"
```bash
# iOS: Verificar Info.plist
# Android: Verificar AndroidManifest.xml
# Solução: Solicitar permissão novamente no app
```

### Erro: "Build falhou"
```bash
# Limpar cache
rm -rf node_modules
npm install

# Limpar cache Expo
expo start --clear
```

### Erro: "Certificado expirado"
```bash
eas credentials
# Renovar certificados
```

## 📊 Monitoramento

### Analytics
- Integração com Sentry para erros
- Google Analytics para eventos
- Crash reporting automático

### Performance
- Monitoramento de FPS
- Uso de memória
- Tempo de carregamento

## 🔄 Atualizações Over-the-Air (OTA)

```bash
# Publicar atualização
eas update

# Configurar rollout gradual
eas update --branch production --message "Nova versão"
```

## 📚 Recursos Adicionais

- [Documentação Expo](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [EAS Build Docs](https://docs.expo.dev/build/introduction)
- [Google Play Console](https://play.google.com/console)
- [Apple App Store Connect](https://appstoreconnect.apple.com)

## 🎯 Checklist Pré-Lançamento

- [ ] Testar em dispositivos reais
- [ ] Verificar permissões
- [ ] Testar offline
- [ ] Verificar performance
- [ ] Testar geolocalização
- [ ] Testar câmera
- [ ] Testar notificações
- [ ] Verificar privacidade
- [ ] Testar internacionalização
- [ ] Preparar screenshots
- [ ] Escrever descrição
- [ ] Configurar pricing (se aplicável)

## 📞 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação oficial
2. Verifique os logs: `expo start --clear`
3. Abra uma issue no GitHub
4. Contate o suporte Expo

---

**Desenvolvido com ❤️ para transformar o comércio ambulante**


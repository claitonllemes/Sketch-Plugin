# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.


###### [1.2.0] - 2026-03-09

#### 🛠️ Refatoração
- Código migrado para **TypeScript** (100% tipado) para maior segurança e facilidade de manutenção.
- Scripts de `build` e `release` convertidos para `.ts` e executados via **Bun**.
- Estrutura do projeto organizada em pastas (`src/`, `types/`).


#### ✨ Adicionado
- **Atualização Inteligente**: O plugin agora preserva as "Color Variables" personalizadas que já existem no documento. Ele identifica e atualiza apenas os grupos de cores pertencentes ao Tailwind (ex: "01 - Base", "02 - Red", etc.), mantendo suas cores customizadas intactas.
- Mensagem de feedback atualizada para "importadas/atualizadas".

#### 📝 Documentação
- Atualização do `README.md` para refletir o novo comportamento de preservação de cores.


###### [1.0.1] - 2024-03-08

#### 🐛 Corrigido
- Ajustes na documentação e instruções de instalação.
- Pequenas melhorias no script de build.


###### [1.0.0] - 2024-03-07

#### 🎉 Lançamento Inicial
- Importação completa da paleta de cores do **Tailwind CSS 4**.
- Conversão automática de valores OKLCH para HEX para compatibilidade com Sketch.
- Organização automática em grupos e tonalidades (50 a 950).

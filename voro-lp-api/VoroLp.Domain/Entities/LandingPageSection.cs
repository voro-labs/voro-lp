namespace VoroLp.Domain.Entities
{
    public class LandingPageSection
    {
        public Guid Id { get; set; }

        // Chave estrangeira
        public Guid LandingPageConfigId { get; set; }
        public LandingPageConfig LandingPageConfig { get; set; } = default!;

        // Tipo da seção (ex: "hero", "pricing", "about", "contact")
        public string SectionType { get; set; } = default!;

        // Conteúdo HTML / JSX renderizável
        public string? HtmlContent { get; set; }

        // JSON com informações específicas (ex: cores, imagens, etc.)
        public string MetaData { get; set; } = "{}";

        // Preço normal e promocional (opcional)
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; }

        // Controle de exibição
        public bool IsVisible { get; set; } = true;
        public int Order { get; set; }
    }
}

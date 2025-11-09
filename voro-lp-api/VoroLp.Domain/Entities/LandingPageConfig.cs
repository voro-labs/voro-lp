namespace VoroLp.Domain.Entities
{
    public class LandingPageConfig
    {
        public Guid Id { get; set; }

        // Nome identificador (ex: "home", "black-friday", etc)
        public string Slug { get; set; } = default!;

        // Seções da landing page (um para muitos)
        public ICollection<LandingPageSection> Sections { get; set; } = [];

        // Regras gerais (ex: data de exibição, versão ativa)
        public bool IsActive { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
    }
}

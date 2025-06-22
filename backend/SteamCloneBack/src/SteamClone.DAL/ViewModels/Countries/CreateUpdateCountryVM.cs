namespace SteamClone.DAL.ViewModels.Countries;

public class CreateUpdateCountryVM
{
    public required string Name { get; set; }
    public required string Alpha2Code { get; set; }
    public required string Alpha3Code { get; set; }
}
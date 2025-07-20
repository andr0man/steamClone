using Microsoft.Extensions.DependencyInjection;

namespace Tests.Common;

public static class TestFactoryExtensions
{
    public static void RemoveServiceByType(this IServiceCollection services, Type serviceType)
    {
        var descriptor = services.SingleOrDefault(s => s.ServiceType == serviceType);
        if (descriptor is not null)
        {
            services.Remove(descriptor);
        }
    }
}
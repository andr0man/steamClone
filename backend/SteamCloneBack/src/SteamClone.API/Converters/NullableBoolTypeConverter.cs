using System.ComponentModel;
using System.Globalization;

namespace SteamClone.API.Converters;

public class NullableBoolTypeConverter : TypeConverter
{
    public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
    {
        return sourceType == typeof(string) || base.CanConvertFrom(context, sourceType);
    }

    public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
    {
        if (value is string stringValue)
        {
            if (string.IsNullOrEmpty(stringValue) || stringValue.Equals("null", StringComparison.OrdinalIgnoreCase))
                return null;
            
            if (bool.TryParse(stringValue, out bool boolValue))
                return boolValue;
        }
        
        return base.ConvertFrom(context, culture, value);
    }
}
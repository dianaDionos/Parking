using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace sipho.visitor.Utils;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class SuppressModelStateInvalidFilterAttribute : Attribute, IActionModelConvention
{
    public void Apply(ActionModel action)
    {
        for (var i = 0; i < action.Filters.Count; i++)
        {
            Microsoft.AspNetCore.Mvc.Filters.IFilterMetadata filter = action.Filters[i];
            if (filter.GetType().Name == "ModelStateInvalidFilterFactory")
            {
                action.Filters.RemoveAt(i);
                break;
            }
        }
    }
}

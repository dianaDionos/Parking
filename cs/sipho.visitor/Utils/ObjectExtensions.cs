using System.IO;
using System.Reflection;
using System.Text.Json;

namespace sipho.visitor.Utils
{
    public static class ObjectExtensions
    {
        #region ChangedProperties-Extensions

        internal class ChangedPropertiesModel
        {
            public string? FieldName { get; set; }

            public string? OldValue { get; set; }

            public string? NewValue { get; set; }
        }

        internal static bool IsSimpleType(this Type type) => TypeDescriptor.GetConverter(type).CanConvertFrom(typeof(string));

        internal static IEnumerable<ChangedPropertiesModel> GetChangedProperties<TypeIn, TypeToCompare>(this TypeIn oldData, TypeToCompare newData)
        {
            if (oldData is not null && newData is not null)
            {
                var type = typeof(TypeIn);
                if (type != typeof(Nullable))
                {
                    return [];
                }
                var allProperties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                var allSimpleProperties = allProperties.Where(pi => pi.PropertyType.IsSimpleType());
                var unequalProperties =
                       from pi in allSimpleProperties
                       let name = pi.GetCustomAttribute<DisplayAttribute>()?.Description
                       let oldValue = type.GetProperty(pi.Name)?.GetValue(oldData, null)
                       let newValue = type.GetProperty(pi.Name)?.GetValue(newData, null)
                       where oldValue != newValue && (oldValue == null || !oldValue.Equals(newValue))
                       select new ChangedPropertiesModel { FieldName = string.IsNullOrEmpty(name) ? pi.Name : name, OldValue = oldValue?.ToString(), NewValue = newValue?.ToString() };

                return [.. unequalProperties];
            }

            return [];
        }

        #endregion ChangedProperties-Extensions

        #region MapTos-Extensions

        #region Sync-Methods

        public static string GetJson<T>(this T obj) where T : class
        {
            return JsonSerializer.Serialize(obj);
        }

        public static int GetHash<T>(this T obj) where T : class
        {
            var serialData = JsonSerializer.Serialize(obj);
            return serialData.GetHashCode();
        }

        public static T? CloneTo<T>(this T obj) where T : class
        {
            if (obj == null)
            {
                return default;
            }

            var serialData = JsonSerializer.Serialize(obj);

            return JsonSerializer.Deserialize<T>(serialData);
        }

        /// <summary>
        ///
        /// </summary>
        /// <typeparam name="T1">Type In</typeparam>
        /// <typeparam name="T2">Type out</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T2? MapTo<T1, T2>(this T1 obj) where T1 : class
        {
            if (obj == null) { return default; }
            var serialData = JsonSerializer.Serialize(obj);

            if (string.IsNullOrEmpty(serialData)) { return default; }

            return JsonSerializer.Deserialize<T2>(serialData)!;
        }

        /// <summary>
        /// Maps an ICollection of TypeIn to an ICollection of TypeOut.
        /// </summary>
        /// <typeparam name="T1">Type In</typeparam>
        /// <typeparam name="T2">Type Out</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static ICollection<T2>? MapToICollection<T1, T2>(this ICollection<T1> obj) where T1 : class
        {
            if (obj == null)
            {
                return [];
            }

            string serialData = JsonSerializer.Serialize(obj);

            if (string.IsNullOrEmpty(serialData))
            {
                return default;
            }

            return JsonSerializer.Deserialize<ICollection<T2>>(serialData);
        }

        /// <summary>
        /// Maps an IEnumerable of TypeIn to an ICollection of TypeOut.
        /// </summary>
        /// <typeparam name="T1">TypeIn</typeparam>
        /// <typeparam name="T2">TypeOut</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static ICollection<T2>? MapToICollection<T1, T2>(this IEnumerable<T1> obj) where T1 : class
        {
            if (obj == null)
            {
                return [];
            }

            string serialData = JsonSerializer.Serialize(obj);

            return JsonSerializer.Deserialize<ICollection<T2>>(serialData);
        }

        /// <summary>
        /// Maps an IEnumerable of TypeIn to an IEnumerable of TypeOut.
        /// This method is useful for converting collections of objects from one type to another.
        /// </summary>
        /// <typeparam name="T1">TypeIn</typeparam>
        /// <typeparam name="T2">TypeOut</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static IEnumerable<T2>? MapToIEnumerable<T1, T2>(this IEnumerable<T1> obj) where T1 : class
        {
            if (obj == null)
            {
                return [];
            }

            string serialData = JsonSerializer.Serialize(obj);

            return JsonSerializer.Deserialize<IEnumerable<T2>>(serialData);
        }

        /// <summary>
        /// Maps an IEnumerable of TypeIn to an IReadOnlyCollection of TypeOut.
        /// This method is useful for converting collections of objects from one type to another while ensuring imm
        /// </summary>
        /// <typeparam name="T1">TypeIn</typeparam>
        /// <typeparam name="T2">TypeOut</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static IReadOnlyCollection<T2>? MapToIReadOnlyCollection<T1, T2>(this IEnumerable<T1>? obj) where T1 : class
        {
            if (obj == null)
            {
                return default;
            }

            string serialData = JsonSerializer.Serialize(obj);

            return JsonSerializer.Deserialize<IReadOnlyCollection<T2>>(serialData);
        }

        #endregion Sync-Methods

        #region Async-Methods

        /// <summary>
        /// Maps an object of TypeIn to an object of TypeOut asynchronously.
        /// This method is useful for converting objects from one type to another in an asynchronous manner.
        /// </summary>
        /// <typeparam name="T1">TypeIn</typeparam>
        /// <typeparam name="T2">TypeOut</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public static async Task<T2> MapToAsync<T1, T2>(this Task<T1> obj) where T1 : class
        {
            var serialData = new MemoryStream(
                JsonSerializer.SerializeToUtf8Bytes(
                    obj
                    .GetAwaiter()
                    .GetResult()
                )
            );

            return await JsonSerializer.DeserializeAsync<T2>(serialData) ?? throw new InvalidOperationException("Deserialization failed.");
        }

        /// <summary>
        /// Maps a List of TypeIn to an IReadOnlyCollection of TypeOut asynchronously.
        /// This method is useful for converting lists of objects from one type to another in an asynchronous
        /// </summary>
        /// <typeparam name="T1">TypeIn</typeparam>
        /// <typeparam name="T2">TypeOut</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public static async Task<IReadOnlyCollection<T2>> MapToAsync<T1, T2>(this Task<List<T1>> obj) where T1 : class
        {
            var serialData = new MemoryStream(
                JsonSerializer.SerializeToUtf8Bytes(
                    obj
                    .GetAwaiter()
                    .GetResult()
                )
            );

            return await JsonSerializer.DeserializeAsync<IReadOnlyCollection<T2>>(serialData) ?? throw new InvalidOperationException("Deserialization failed.");
        }

        #endregion Async-Methods

        #endregion MapTos-Extensions

    }
}

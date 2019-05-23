namespace IndicadoresOEE.Common.Util
{
    using System;
    using System.Security.Cryptography;
    using System.Text;

    public static class Encriptador
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_encrypt"></param>
        /// <param name="_hashing"></param>
        /// <returns></returns>
        public static string Encriptar(string _encrypt, bool _hashing)
        {
            byte[] _result = null;
            try
            {
                byte[] _keyBytes;
                byte[] _encryptBytes = Encoding.UTF8.GetBytes(_encrypt);
                string _key = "itachi";
                if (_hashing)
                {
                    MD5CryptoServiceProvider _md5 = new MD5CryptoServiceProvider();
                    _keyBytes = _md5.ComputeHash(Encoding.UTF8.GetBytes(_key));
                    _md5.Clear();
                }
                else
                {
                    _keyBytes = Encoding.UTF8.GetBytes(_key);
                }
                TripleDESCryptoServiceProvider _3des = new TripleDESCryptoServiceProvider();
                _3des.Key = _keyBytes;
                _3des.Mode = CipherMode.ECB;
                _3des.Padding = PaddingMode.PKCS7;
                ICryptoTransform _crypto = _3des.CreateEncryptor();
                _result = _crypto.TransformFinalBlock(_encryptBytes, 0, _encryptBytes.Length);
                _3des.Clear();
            }
            catch (Exception ex) { }
            return Convert.ToBase64String(_result, 0, _result.Length);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_decrypt"></param>
        /// <param name="_hashing"></param>
        /// <returns></returns>
        public static string Desencriptar(string _decrypt, bool _hashing)
        {
            byte[] _result = null;
            try
            {
                byte[] _keyBytes;
                byte[] _decryptBytes = Convert.FromBase64String(_decrypt);
                string _key = "itachi";
                if (_hashing)
                {
                    MD5CryptoServiceProvider _md5 = new MD5CryptoServiceProvider();
                    _keyBytes = _md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(_key));
                    _md5.Clear();
                }
                else
                {
                    _keyBytes = Encoding.UTF8.GetBytes(_key);
                }
                TripleDESCryptoServiceProvider _3des = new TripleDESCryptoServiceProvider();
                _3des.Key = _keyBytes;
                _3des.Mode = CipherMode.ECB;
                _3des.Padding = PaddingMode.PKCS7;
                ICryptoTransform _crypto = _3des.CreateDecryptor();
                _result = _crypto.TransformFinalBlock(_decryptBytes, 0, _decryptBytes.Length);
                _3des.Clear();
            }
            catch (Exception ex) { }
            return Encoding.UTF8.GetString(_result);
        }
    }
}
